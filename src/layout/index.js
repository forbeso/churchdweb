"use client"

import { useContext, useState, useRef, useEffect } from "react"
import { Outlet, useNavigate, Link } from "react-router-dom"

import supabase from "../supabase"
import { SupabaseContext } from "../SupabaseContext"
import "./style.scss"
import ChurchIcon from "../assets/churchicon"
import Newnav from "../newnav"
import MenuIcon from "@mui/icons-material/Menu"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import LogoutIcon from "@mui/icons-material/Logout"
import CloseIcon from "@mui/icons-material/Close"
import Avatar from "boring-avatars"
import { stripEmail } from "../utils/utils"

function Layout({ children }) {
  const { session, updateSession } = useContext(SupabaseContext)
  const navigate = useNavigate()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [showPopover, setShowPopover] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUserData, setNewUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signupError, setSignupError] = useState("")
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [userDisplayName, setUserDisplayName] = useState("")

  const avatarRef = useRef(null)
  const popoverRef = useRef(null)
  const modalRef = useRef(null)

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  const signOutUser = async () => {
    if (session) {
      const { error } = await supabase.auth.signOut()
      navigate("/")
    }
  }

  const handleAddUserClick = () => {
    setShowPopover(false)
    setShowAddUserModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUserData({
      ...newUserData,
      [name]: value,
    })

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!newUserData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(newUserData.email)) {
      errors.email = "Email is invalid"
    }

    if (!newUserData.password) {
      errors.password = "Password is required"
    } else if (newUserData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (newUserData.password !== newUserData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (!newUserData.firstName) {
      errors.firstName = "First name is required"
    }

    if (!newUserData.lastName) {
      errors.lastName = "Last name is required"
    }

    return errors
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setSignupError("")
    setSignupSuccess(false)

    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      // Sign up the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: newUserData.email,
        password: newUserData.password,
        options: {
          data: {
            first_name: newUserData.firstName,
            last_name: newUserData.lastName,
          },
        },
      })

      if (error) {
        throw error
      }

      // Add user to your users table if needed
      const { error: profileError } = await supabase
        .from("profiles") // Adjust table name as needed
        .insert([
          {
            id: data.user.id,
            first_name: newUserData.firstName,
            last_name: newUserData.lastName,
            email: newUserData.email,
          },
        ])

      if (profileError) {
        throw profileError
      }

      // Success
      setSignupSuccess(true)
      setNewUserData({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      })

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowAddUserModal(false)
        setSignupSuccess(false)
      }, 2000)
    } catch (error) {
      setSignupError(error.message || "An error occurred during signup")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setShowPopover(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setShowAddUserModal(false)
      }
    }

    if (showAddUserModal) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [showAddUserModal])

  // Fetch user profile data when session changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        try {
          // First check if user metadata has the name
          if (session.user.user_metadata?.first_name && session.user.user_metadata?.last_name) {
            setUserDisplayName(`${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name}`)
            return
          }

          // Otherwise fetch from profiles table
          const { data, error } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", session.user.id)
            .single()

          if (error) {
            console.error("Error fetching user profile:", error)
            return
          }

          if (data) {
            setUserDisplayName(`${data.first_name} ${data.last_name}`)
          }
        } catch (error) {
          console.error("Error in profile fetch:", error)
        }
      }
    }

    fetchUserProfile()
  }, [session])

  return (
    <div className="flex flex-col h-screen ">
      <header className="flex flex-row items-center justify-between bg-white px-6 py-4 border-gray-800">
        <div className="flex items-center gap-4">
          <div>
            <MenuIcon onClick={toggleNav} className="cursor-pointer"></MenuIcon>
          </div>
          <Link className="flex items-center gap-2" to="/cdeck/home">
            <ChurchIcon className="h-6 w-6 text-dark " />
            <span className="text-lg font-semibold text-dark ">Churchdeck</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsNoneIcon />
          {userDisplayName ? (
            <span className="text-sm font-medium">{userDisplayName}</span>
          ) : (
            session && <span className="text-sm">{stripEmail(session.user.email)}</span>
          )}
          <div className="relative">
            <div ref={avatarRef} onClick={() => setShowPopover(!showPopover)} className="cursor-pointer">
              <Avatar
                size={40}
                name={userDisplayName || session?.user?.email || "User"}
                variant="marble"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </div>

            {showPopover && (
              <div
                ref={popoverRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
              >
                <button
                  onClick={handleAddUserClick}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <PersonAddIcon className="mr-2 text-gray-500" fontSize="small" />
                  Add User
                </button>
                <button
                  onClick={() => {
                    signOutUser()
                    setShowPopover(false)
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogoutIcon className="mr-2 text-gray-500" fontSize="small" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isNavOpen && <Newnav isNavOpen={isNavOpen} toggleNav={toggleNav} />}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        {children}
        <Outlet />
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Add New User</h2>
              <button onClick={() => setShowAddUserModal(false)} className="text-gray-500 hover:text-gray-700">
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6">
              {signupSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  User created successfully! An email has been sent for verification.
                </div>
              )}

              {signupError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{signupError}</div>}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={newUserData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.firstName ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.firstName && <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={newUserData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.lastName ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.lastName && <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={newUserData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUserData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formErrors.password ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={newUserData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md mr-2 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout
