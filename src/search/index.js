import React, { useEffect, useState, useContext, ChangeEvent } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import Avatar from 'boring-avatars';

import './search.scss';
import supabase from '../supabase';

import Loader from '../loader';

import { SupabaseContext } from '../SupabaseContext';

function MemberInfoDialog({
  memberInfo,
  show,
  onClose,
  onConfirmUpdate,
  confirmErr,
  confirmMessage,
}) {
  return (
    <div className="confirmBox  rounded animate__animated animate__fadeIn">
      <div className="closeButton" onClick={onClose}>
        <span className="material-icons-outlined text-danger">close</span>
      </div>

      <div className="extendedBoxContent text-center">
        <div>
          <h3 className="text-head mb-4">
            Confirm the details below before updating {memberInfo.first_name}'s
            information
          </h3>
        </div>
        <div>
          <strong>Last Name:</strong> {memberInfo.last_name}
        </div>
        <div>
          <strong>First Name:</strong> {memberInfo.first_name}
        </div>
        <div>
          <strong>Email:</strong> {memberInfo.email}
        </div>
        <div>
          <strong>Member ID:</strong> {memberInfo.member_id}
        </div>
        <div>
          <strong>Ministry:</strong> {memberInfo.ministry}
        </div>
        <div>
          <strong>Sex:</strong> {memberInfo.sex}
        </div>
        <div>
          <strong>Date of Birth:</strong> {memberInfo.dob}
        </div>
        <div>
          <strong>Home Phone:</strong> {memberInfo.home_phone}
        </div>
        <div>
          <strong>Mobile Phone:</strong> {memberInfo.mobile_phone}
        </div>
        <div>
          <strong>Address:</strong> {memberInfo.address}
        </div>
        <div>
          <strong>City:</strong> {memberInfo.city}
        </div>
        <div>
          <strong>State/Province:</strong> {memberInfo.state_province}
        </div>
        <div>
          <strong>Zip/Postal Code:</strong> {memberInfo.zip_postal_code}
        </div>
        <div>
          <strong>Country/Region:</strong> {memberInfo.country_region}
        </div>
        <div>
          <strong>Notes:</strong> {memberInfo.notes}
        </div>
        <div>
          <strong>Attachments:</strong> {memberInfo.attachments}
        </div>
        <div>
          <strong>Status:</strong> {memberInfo.status}
        </div>
        <div>
          <strong>Physician Name:</strong> {memberInfo.physician_name}
        </div>
        <div>
          <strong>Physician Phone:</strong> {memberInfo.physician_phone}
        </div>
        <div>
          <strong>Allergies:</strong> {memberInfo.allergies}
        </div>
        <div>
          <strong>Medications:</strong> {memberInfo.medications}
        </div>
        <div>
          <strong>Insurance Carrier:</strong> {memberInfo.insurance_carrier}
        </div>
        <div>
          <strong>Insurance Number:</strong> {memberInfo.insurance_number}
        </div>
        <div>
          <strong>Type:</strong> {memberInfo.type}
        </div>

        <button className="btn btn-primary mt-4 mb-3" onClick={onConfirmUpdate}>
          Confirm Update
        </button>

        {confirmErr && confirmMessage ? (
          <div className="bg-danger p-3">
            <span>{confirmMessage}</span>
          </div>
        ) : (
          <div className="bg-success p-3">
            <span>{confirmMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Search() {
  const { session, updateSession } = useContext(SupabaseContext);

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [searchResults, setSearchResults] = useState([]); // new state variable to store search results
  const [memberTypeFilter, setMemberTypeFilter] = useState('Everyone');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [emailAd, setEmail] = useState('');
  const [memberId, setMemberId] = useState('');
  const [ministry, setMinistry] = useState('');
  const [sex, setSex] = useState('');
  const [date_of_birth, setDob] = useState('');
  const [homePhone, setHomePhone] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [addressL1, setAddress] = useState('');
  const [cityAd, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [zipPostalCode, setZipPostalCode] = useState('');
  const [countryRegion, setCountryRegion] = useState('');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState('');
  const [status, setStatus] = useState('');
  const [physicianName, setPhysicianName] = useState('');
  const [physicianPhone, setPhysicianPhone] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [insuranceCarrier, setInsuranceCarrier] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [type, setType] = useState('');

  // const [file, setFile] = useState<File | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState('');
  const [changedFields, setChangedFields] = useState([]);
  const [showMemberInfoDialog, setShowMemberInfoDialog] = useState(false);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [ministryError, setMinistryError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [sexError, setSexError] = useState(false);
  const [cityError, setCityAdError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [dobError, setDOBError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [addError, setAddError] = useState(false);
  const [addResponseMessage, setAddResponseMessage] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  const [editRequiredError, setRequiredError] = useState('');
  const [editFnError, setEditFnError] = useState(false);
  const [editLnError, setEditLnError] = useState(false);
  const [editAdError, setEditAdError] = useState(false);
  const [editCiError, setEditCiError] = useState(false);
  const [editEmError, setEditEmError] = useState(false);
  const [editSxError, setEditSxError] = useState(false);
  const [editCrError, setEditCrError] = useState(false);
  const [duplicateError, setDuplicateError] = useState('');
  const [confirmError, setConfirmError] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState('');
  const [minsitryList, setMinistryList] = useState([]);

  const [loggedIn, setLoggedin] = useState(false);
  useEffect(() => {
    const user = session?.user;

    if (!session) {
      navigate('/');
    } else {
      setLoggedin(true);
    }

    async function getAllMembers() {
      setIsLoading(true);
      const { data: membervis, error } = await supabase
        .from(process.env.REACT_APP_MEMBERVIS_TABLE)
        .select('*');
      setIsLoading(false);
      setMemberData(membervis);
    }

    getAllMembers();

    async function getMinistries() {
      const { data: ministry, error } = await supabase
        .from('ministry')
        .select('name');
      setMinistryList(ministry);
    }

    getMinistries();
  }, [navigate, session, session?.user]);

  const noteStrip = (note) => {
    if (note === '' || note === null) {
      return '';
    }
    const text = note;
    const regex = /<div>(?!\s*<div>&nbsp;<\/div>)(.*?)<\/div>/g;
    const matches = [...text.matchAll(regex)];
    const results = matches.map((match) => match[1]);

    return results.join('\n');
  };

  const handleSelectedMember = (member) => {
    setSelectedMember(member);
  };
  const handleCloseExtendedBox = () => {
    setSelectedMember(null);
  };

  const handleOnChange = (query) => {
    setSearchQuery(query.target.value);

    const filteredMembers = filteredMembersByStatus.filter((member) => {
      const memberFullName = `${member.first_name} ${member.last_name}`;
      return memberFullName
        .toLowerCase()
        .includes(query.target.value.toLowerCase());
    });

    setSearchResults(filteredMembers);
  };

  // filter members by type based on type filter
  const filteredMembers = memberData.filter((member) => {
    if (memberTypeFilter === 'Everyone' && member) {
      return true;
    }
    if (memberTypeFilter === 'Members' && member.type === 'Member') {
      return true;
    }
    if (memberTypeFilter === 'Visitors' && member.type === 'Visitor') {
      return true;
    }
    return false;
  });

  // filter members by status based on active status filter
  const filteredMembersByStatus = filteredMembers.filter((member) => {
    if (activeStatusFilter === 'All' && member) {
      return true;
    }
    if (activeStatusFilter === 'Active' && member.status === 'Active') {
      return true;
    }
    if (activeStatusFilter === 'Inactive' && member.status === 'Inactive') {
      return true;
    }
    if (activeStatusFilter === 'Migrated' && member.status === 'Migrated') {
      return true;
    }
    if (
      activeStatusFilter === 'Left Church' &&
      member.status === 'Left Church'
    ) {
      return true;
    }
    if (activeStatusFilter === 'Deceased' && member.status === 'Deceased') {
      return true;
    }
    return false;
  });

  // update members to display based on whether search results are present
  const membersToDisplay = searchQuery
    ? searchResults
    : filteredMembersByStatus;

  const handleMemTypeFilter = (filter) => {
    setMemberTypeFilter(filter);
  };

  const handleStatusFilterClick = (status) => {
    setActiveStatusFilter(status);
  };

  function createUniqueID(fn, ln) {
    const firstInitial = fn.charAt(0).toUpperCase();
    const lastInitial = ln.charAt(0).toUpperCase();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    setMemberId(`ALM-${firstInitial}${lastInitial}-${randomNumber}`);
  }

  const handleAddMember = async () => {
    // Check if required fields are empty and set error state variables accordingly
    if (!firstName) {
      setFirstNameError(true);
    }
    if (!lastName) {
      setLastNameError(true);
    }
    // if (!ministry) {
    //   setMinistryError(true);
    // }

    // if (!emailAd) {
    //   setEmailError(true);
    // }

    if (!sex) {
      setSexError(true);
    }

    if (!date_of_birth) {
      setDOBError(true);
    }

    if (!cityAd) {
      setCityAdError(true);
    }

    if (!countryRegion) {
      setCountryError(true);
    }

    if (!addressL1) {
      setAddressError(true);
    }
    // Add more error checks for each required input field

    // Only insert data if all required fields are filled out
    if (firstName && lastName) {
      createUniqueID(firstName, lastName);
    }

    if (firstName && lastName && emailAd) {
      const isDuplicate = memberData.some(
        (item) =>
          item.first_name === firstName &&
          item.last_name === lastName &&
          item.dob === date_of_birth,
      );
      if (!isDuplicate) {
        const { data, error } = await supabase
          .from(process.env.REACT_APP_MEMBERVIS_TABLE)
          .insert([
            {
              member_id: memberId,
              first_name: firstName,
              last_name: lastName,
              ministry: ministry,
              sex: sex,
              email: emailAd,
              dob: date_of_birth,
              home_phone: homePhone,
              mobile_phone: mobilePhone,
              address: addressL1,
              city: cityAd,
              state_province: stateProvince,
              zip_postal_code: zipPostalCode,
              country_region: countryRegion,
              notes: notes,
              attachments: attachments,
              physician_name: physicianName,
              physician_phone: physicianPhone,
              allergies: allergies,
              medications: medications,
              insurance_carrier: insuranceCarrier,
              insurance_number: insuranceNumber,
              type: type,
            },
          ])
          .select();

        if (error) {
          console.log(error);

          setAddError(true);
          setAddSuccess(false);
          let msg = '';
          if (error.message === 'invalid input syntax for type date: ""') {
            msg = 'Please check the date of birth selection again.';
          } else {
            msg = error.message;
          }
          setAddResponseMessage(msg);
        }
        if (data) {
          const msg = `Congrats, ${firstName} is now apart of your church family.`;

          if (addError) {
            setAddError(false);
          }
          setAddSuccess(true);
          setAddResponseMessage(msg);
        }
      } else {
        setDuplicateError(
          `It seems you have already added ${firstName} ${lastName} to your church`,
        );
      }
    }
  };

  const handleGetFile = (query) => {
    if (query.target.files) {
      setFile(query.target.files[0]);
    }
  };

  const handleOpenInfoDialog = () => {
    const { first_name, last_name, address, city, sex, dob, country_region } =
      selectedMember || {};

    if (!first_name) {
      setEditFnError(true);
    }
    if (!last_name) {
      setEditLnError(true);
    }
    if (!address) {
      setEditAdError(true);
    }
    if (!city) {
      setEditCiError(true);
    }
    if (!sex) {
      setEditSxError(true);
    }
    if (!country_region) {
      setEditCrError(true);
    }

    if (first_name && last_name && address && city && sex && country_region) {
      setShowMemberInfoDialog(true);
    }
  };

  const handleCloseInfoDialog = () => {
    setShowMemberInfoDialog(false);
  };

  const handleConfirmUpdate = async () => {
    const { data, error } = await supabase
      .from(process.env.REACT_APP_MEMBERVIS_TABLE)
      .update(selectedMember)
      .match({ member_id: selectedMember.member_id });

    if (error) {
      setConfirmError(true);
      setConfirmMsg(
        `Error Updating ${selectedMember.first_name}'s information`,
      );
      console.log('Error updating record:', error.message);
    } else {
      setConfirmError(false);
      setConfirmMsg(
        `Successfully Updated ${selectedMember.first_name}'s information`,
      );
      console.log('Record updated successfully:', data);
      //setShowMemberInfoDialog(false);
    }
  };

  const handleAttachmentUpload = async () => {
    const { data, error } = await supabase.storage
      .from('attachments')
      .upload(file?.path, file);

    if (error) {
      console.log('Error uploading file:', error.message);
    } else {
      console.log(data.path);
    }
  };

  const handleClose = () => {
    setShowMenu(!showMenu);
  };

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from(process.env.REACT_APP_MEMBERVIS_TABLE)
      .delete()
      .eq('id', 'df22e057-56ba-4ed8-86a1-df89c79ea9c4');
  };

  const handleEditOnChange = (event) => {
    const { name, value } = event.target;

    setSelectedMember((prevMember) => ({
      ...prevMember,
      [name]: value,
    }));

    setChangedFields((prevFields) => {
      if (!prevFields.includes(name)) {
        return [...prevFields, name];
      }
      return prevFields;
    });
  };

  return (
    <>
      <div>
        <h1>Search Members</h1>
        <p>Find and access information about church members quickly.</p>
      </div>
      <div className="input-group mb-3 mt-5 searchInputGroup">
        <input
          type="text"
          className="form-control input"
          placeholder="search by first or last name"
          aria-label="member name"
          aria-describedby="basic-addon2"
          value={searchQuery}
          onChange={(query) => handleOnChange(query)}
        />
        {/* <div className="input-group-append">
              <button className="btn btn-outline-secondary btn-custom" type="button" >SEARCH</button>
            </div> */}
      </div>

      <div
        className="d-flex flex-row flex-wrap justify-content-around mb-2 pillFilters"
        style={{ height: 110 }}
      >
        <button
          className={
            memberTypeFilter === 'Everyone' ? 'btn pill activePill' : 'btn pill'
          }
          onClick={() => handleMemTypeFilter('Everyone')}
        >
          Everyone
        </button>
        <button
          className={
            memberTypeFilter === 'Members' ? 'btn pill activePill' : 'btn pill'
          }
          onClick={() => handleMemTypeFilter('Members')}
        >
          Members
        </button>

        <button
          className={
            memberTypeFilter === 'Visitors' ? 'btn pill activePill' : 'btn pill'
          }
          onClick={() => handleMemTypeFilter('Visitors')}
        >
          Visitors
        </button>

        <div className="dropdown">
          <button
            className="btn active_inactive_pill dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="text-primary">Status:</span> {activeStatusFilter}
          </button>
          <ul className="dropdown-menu" aria-labelledby="filter-dropdown">
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleStatusFilterClick('All')}
              >
                All
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleStatusFilterClick('Active')}
              >
                Active
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleStatusFilterClick('Inactive')}
              >
                Inactive
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleStatusFilterClick('Migrated')}
              >
                Migrated
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleStatusFilterClick('Left Church')}
              >
                Left Church
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleStatusFilterClick('Deceased')}
              >
                Deceased
              </button>
            </li>
          </ul>
        </div>

        <button
          className="btn addPill text-center"
          onClick={() => setShowModal(true)}
        >
          <i className="material-icons-outlined">person_add</i>
        </button>
        <Modal show={showModal}>
          <Modal.Header closeVariant="white">
            <div
              className="closeButton"
              onClick={() => {
                setShowModal(false);
                setAddError(false);
                setAddSuccess(false);
                setDuplicateError('');
              }}
            >
              <span className="material-icons-outlined text-danger">close</span>
            </div>
            <Modal.Title>Add Member / Visitor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Please fill out the form below to add a new member to the church
              database. Fields marked with an asterisk (*) are required.
            </p>

            <hr />

            <form className="d-flex flex-row flex-wrap justify-content-around">
              <div className="form-group">
                <label htmlFor="first_name">First Name *</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  className="form-control"
                  id="first_name"
                  name="first_name"
                  placeholder=""
                  value={firstName}
                  onChange={(query) => {
                    setFirstName(query.target.value);
                    setFirstNameError(false);
                  }}
                />
                {firstNameError && (
                  <p className="text-danger">This field is required</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name *</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  className="form-control"
                  id="last_name"
                  name="last_name"
                  placeholder=""
                  value={lastName}
                  onChange={(query) => {
                    setLastName(query.target.value);
                    setLastNameError(false);
                  }}
                />
                {lastNameError && (
                  <p className="text-danger">This field is required</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  required
                  maxLength={50}
                  className="form-control"
                  id="email"
                  name="email"
                  aria-describedby="emailHelp"
                  placeholder=""
                  value={emailAd}
                  onChange={(query) => {
                    setEmail(query.target.value);
                    setEmailError(false);
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="member_id">Member ID *</label>
                <input
                  type="text"
                  required
                  disabled
                  className="form-control"
                  id="member_id"
                  name="member_id"
                  placeholder=""
                  value={memberId}
                  onChange={(query) => setMemberId(query.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ministry">Ministry</label>

                <select
                  className="form-control"
                  required
                  id="ministry"
                  name="ministry"
                  value={ministry}
                  onChange={(e) => {
                    setMinistry(e.target.value);
                    setMinistryError(false);
                  }}
                >
                  <option value="">Select Ministry</option>
                  {minsitryList &&
                    minsitryList.map((ministry, index) => (
                      <option key={index} value={ministry.name}>
                        {ministry.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="sex">Sex *</label>
                <select
                  className="form-control"
                  required
                  id="sex"
                  name="sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                >
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                {sexError && (
                  <p className="text-danger">This field is required</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dob">Date of Birth *</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  id="dob"
                  name="dob"
                  placeholder=""
                  value={date_of_birth}
                  onChange={(query) => setDob(query.target.value)}
                />
                {dobError && (
                  <p className="text-danger">This field is required</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="home_phone">
                  Home Phone{' '}
                  <span>
                    <small></small>
                  </span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  className="form-control"
                  id="home_phone"
                  name="home_phone"
                  placeholder=""
                  value={homePhone}
                  onChange={(query) => setHomePhone(query.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mobile_phone">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  className="form-control"
                  id="mobile_phone"
                  name="mobile_phone"
                  placeholder=""
                  value={mobilePhone}
                  onChange={(query) => setMobilePhone(query.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  className="form-control"
                  id="address"
                  name="address"
                  placeholder=""
                  value={addressL1}
                  onChange={(query) => setAddress(query.target.value)}
                />
                {addressError && (
                  <p className="text-danger">This field is required</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  className="form-control"
                  id="city"
                  name="city"
                  placeholder=""
                  value={cityAd}
                  onChange={(query) => setCity(query.target.value)}
                />

                {cityError && (
                  <p className="text-danger">This field is required</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="state_province">State / Province</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  className="form-control"
                  id="state_province"
                  name="state_province"
                  placeholder=""
                  value={stateProvince}
                  onChange={(query) => setStateProvince(query.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip_postal_code">
                  Zip{' '}
                  <span>
                    <small></small>
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={7}
                  required
                  className="form-control"
                  id="zip"
                  name="zip"
                  placeholder=""
                  value={zipPostalCode}
                  onChange={(query) => setZipPostalCode(query.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="country_region">Country / Region *</label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  className="form-control"
                  id="country_region"
                  name="country_region"
                  placeholder=""
                  value={countryRegion}
                  onChange={(query) => setCountryRegion(query.target.value)}
                />

                {countryError && (
                  <p className="text-danger">This field is required</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="notes">
                  Notes{' '}
                  <span>
                    <small></small>
                  </span>
                </label>
                <textarea
                  className="form-control"
                  maxLength={100}
                  id="notes"
                  name="notes"
                  rows="3"
                  placeholder="Enter notes"
                  value={notes}
                  onChange={(query) => setNotes(query.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="attachments">
                  Attachments
                  <span>
                    <small></small>
                  </span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="attachments"
                  name="attachments"
                  placeholder=""
                  disabled
                  onChange={(query) => handleGetFile(query)}
                />

                {/* <input type="file" className="form-control-file" id="attachments" name="attachments" value={attachments} onChange={(query)=> setAttachments(query.target.value)}/> */}
              </div>
              <div className="form-group">
                <label htmlFor="status">
                  Status{' '}
                  <span>
                    <small></small>
                  </span>
                </label>
                <select
                  className="form-control"
                  required
                  id="status"
                  name="status"
                  value={status}
                  onChange={(query) => setStatus(query.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Left Church">Left Church</option>
                  <option value="Migrated">Migrated</option>
                  <option value="Deceased">Deceased</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="physician_name">
                  Physician Name{' '}
                  <span>
                    <small></small>
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={25}
                  className="form-control"
                  id="physician_name"
                  name="physician_name"
                  placeholder=""
                  value={physicianName}
                  onChange={(query) => setPhysicianName(query.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="physician_phone">
                  Physician Phone{' '}
                  <span>
                    <small></small>
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  className="form-control"
                  id="physician_phone"
                  name="physician_phone"
                  placeholder=""
                  value={physicianPhone}
                  onChange={(query) => setPhysicianPhone(query.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="allergies">
                  Allergies{' '}
                  <span>
                    <small></small>
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={40}
                  className="form-control"
                  id="allergies"
                  name="allergies"
                  placeholder=""
                  value={allergies}
                  onChange={(query) => setAllergies(query.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="medications">
                  Medications{' '}
                  <span>
                    <small></small>
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={60}
                  className="form-control"
                  id="medications"
                  name="medications"
                  placeholder=""
                  value={medications}
                  onChange={(query) => setMedications(query.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="insurance_carrier">
                  Insurance Carrier{' '}
                  <span>
                    <small></small>
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={20}
                  className="form-control"
                  id="insurance_carrier"
                  name="insurance_carrier"
                  placeholder=""
                  value={insuranceCarrier}
                  onChange={(query) => setInsuranceCarrier(query.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="insurance_number">
                  Insurance Number{' '}
                  <span>
                    <small></small>
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={15}
                  className="form-control"
                  id="insurance_number"
                  name="insurance_number"
                  placeholder=""
                  value={insuranceNumber}
                  onChange={(query) => setInsuranceNumber(query.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">
                  Member type:{' '}
                  <span>
                    <small></small>
                  </span>
                </label>
                <select
                  className="form-control"
                  required
                  id="type"
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Member">Member</option>
                  <option value="Visitor">Visitor</option>
                </select>
              </div>
            </form>

            <blockquote className="blockquote">
              <p className="mb-0">
                <small>
                  And the lord said unto the servant, Go out into the highways
                  and hedges, and compel them to come in, that my house may be
                  filled.
                </small>
              </p>
              <footer className="blockquote-footer">
                <cite title="Source Title">Luke 14:23</cite>
              </footer>
            </blockquote>

            <hr />
            {addError ? (
              <div className="bg-danger p-2 mb-3">
                <p className="text-white">{addResponseMessage}</p>
              </div>
            ) : (
              ''
            )}

            {addSuccess ? (
              <div className="bg-success p-2 mb-3">
                <span className="text-white">{addResponseMessage}</span>
              </div>
            ) : (
              ''
            )}
            {duplicateError ? (
              <div className="bg-info p-2 mb-3">
                <span className="text-white">{duplicateError}</span>
              </div>
            ) : (
              ''
            )}

            <button
              type="submit"
              onClick={() => handleAddMember()}
              className="btn btn-primary"
            >
              Save and Upload
            </button>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => {
                setShowModal(false);
                setAddError(false);
                setAddSuccess(false);
                setDuplicateError('');
              }}
              className="btn btn-danger"
            >
              X
            </button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="searchResults d-flex flex-wrap justify-content-center">
        {isLoading ? (
          <Loader />
        ) : (
          membersToDisplay.map((member) => (
            <div
              key={member.member_id}
              className={`profileCardBody d-flex flex-column align-items-center p-2 m-1 animate__animated animate__fadeInUp ${
                selectedMember === member ? 'selectedMember' : ''
              }`}
              onClick={() => handleSelectedMember(member)}
            >
              <Avatar
                size={40}
                name={member.member_id}
                variant="beam"
                colors={['#FFAD08', '#EDD75A', '#73B06F', '#0C8F8F', '#405059']}
              />
              <div className="mt-2">{member.member_id}</div>
              <div>
                {member.first_name} {member.last_name}
              </div>
              {/* <div>{member.type}</div> */}
              <div>{member.status}</div>
            </div>
          ))
        )}
        {selectedMember && (
          <div className="extendedBox  rounded animate__animated animate__fadeIn">
            <div className="closeButton" onClick={handleCloseExtendedBox}>
              <span className="material-icons-outlined text-danger">close</span>
            </div>

            <div className="extendedBoxContent">
              <h3 className="mb-3 text-center">
                {selectedMember.first_name} {selectedMember.last_name}'s
                information{' '}
              </h3>
              <p className="text-center">
                <small>
                  Edit the fields you wish to update for{' '}
                  {selectedMember.first_name}.
                </small>
              </p>
              <form className="d-flex flex-row flex-wrap justify-content-around">
                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder=""
                    value={selectedMember.first_name ?? ''}
                    onChange={handleEditOnChange}
                  />
                  {editFnError && (
                    <p className="text-danger">first name is required</p>
                  )}

                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder=""
                    value={selectedMember.email ?? ''}
                    onChange={handleEditOnChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder=""
                    value={selectedMember.last_name ?? ''}
                    onChange={handleEditOnChange}
                  />
                  {editLnError && (
                    <p className="text-danger">Last Name is required</p>
                  )}

                  <label htmlFor="sex">Sex *</label>
                  <select
                    className="form-control"
                    required
                    id="sex"
                    name="sex"
                    value={selectedMember.sex ?? ''}
                    onChange={handleEditOnChange}
                  >
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  {editSxError && (
                    <p className="text-danger">This field is required</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="ministry">Ministry</label>
                  <select
                    className="form-control"
                    required
                    id="ministry"
                    name="ministry"
                    value={selectedMember.ministry ?? ''}
                    onChange={handleEditOnChange}
                  >
                    <option value="">Select Ministry</option>
                    {minsitryList &&
                      minsitryList.map((ministry, index) => (
                        <option key={index} value={ministry.name}>
                          {ministry.name}
                        </option>
                      ))}
                  </select>

                  <label htmlFor="status">Status</label>
                  <select
                    className="form-control"
                    required
                    id="status"
                    name="status"
                    value={selectedMember.status ?? ''}
                    onChange={handleEditOnChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Left Church">Left Church</option>
                    <option value="Migrated">Migrated</option>
                    <option value="Deceased">Deceased</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder=""
                    value={selectedMember.address ?? ''}
                    onChange={handleEditOnChange}
                  />

                  {editAdError && (
                    <p className="text-danger">Adress is required</p>
                  )}

                  <label htmlFor="mobile_phone">Mobile Phone</label>
                  <input
                    type="text"
                    id="mobile_phone"
                    name="mobile_phone"
                    placeholder=""
                    value={selectedMember.mobile_phone ?? ''}
                    onChange={handleEditOnChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="home_phone">Home Phone:</label>
                  <input
                    type="text"
                    id="home_phone"
                    name="home_phone"
                    placeholder=""
                    value={selectedMember.home_phone ?? ''}
                    onChange={handleEditOnChange}
                  />
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder=""
                    value={selectedMember.city ?? ''}
                    onChange={handleEditOnChange}
                  />{' '}
                  {editCiError && (
                    <p className="text-danger">City is required</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="state_province">State / Province</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    id="state_province"
                    name="state_province"
                    placeholder=""
                    value={selectedMember.state_province ?? ''}
                    onChange={handleEditOnChange}
                  />

                  <label htmlFor="zip_postal_code">Zip</label>
                  <input
                    type="text"
                    maxLength={7}
                    required
                    id="zip"
                    name="zip_postal_code"
                    placeholder=""
                    value={selectedMember.zip_postal_code ?? ''}
                    onChange={handleEditOnChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country_region">Country / Region *</label>
                  <input
                    type="text"
                    required
                    maxLength={20}
                    id="country_region"
                    name="country_region"
                    placeholder=""
                    value={selectedMember.country_region ?? ''}
                    onChange={handleEditOnChange}
                  />
                  {editCrError && (
                    <p className="text-danger">Country / Region is required</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="physician_name">Physician Name</label>
                  <input
                    type="text"
                    id="physician_name"
                    name="physician_name"
                    placeholder=""
                    value={selectedMember.physician_name ?? ''}
                    onChange={handleEditOnChange}
                  />

                  <label htmlFor="physician_phone">Physician Phone</label>
                  <input
                    type="text"
                    id="physician_phone"
                    placeholder=""
                    value={selectedMember.physician_phone ?? ''}
                    onChange={handleEditOnChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="allergies">Allergies</label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    placeholder=""
                    value={selectedMember.allergies ?? ''}
                    onChange={handleEditOnChange}
                  />

                  <label htmlFor="medications">Medications</label>
                  <input
                    type="text"
                    id="medications"
                    name="medications"
                    placeholder=""
                    value={selectedMember.medications ?? ''}
                    onChange={handleEditOnChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="insurance_carrier">Insurance Carrier</label>
                  <input
                    type="text"
                    id="insurance_carrier"
                    name="insurance_carrier"
                    placeholder=""
                    value={selectedMember.insurance_carrier ?? ''}
                    onChange={handleEditOnChange}
                  />

                  <label htmlFor="insurance_number">Insurance No.</label>
                  <input
                    type="text"
                    id="insurance_number"
                    name="insurance_number"
                    placeholder=""
                    value={selectedMember.insurance_number ?? ''}
                    onChange={handleEditOnChange}
                  />
                </div>
                <div className="form-group form-group-notes d-flex flex-column">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    rows={5}
                    cols={10}
                    id="notes"
                    name="notes"
                    value={selectedMember.notes ?? ''}
                    onChange={handleEditOnChange}
                  />
                </div>
              </form>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => handleOpenInfoDialog()}
            >
              Update
            </button>
          </div>
        )}
      </div>
      {/* Member Info Dialog */}
      {showMemberInfoDialog ? (
        <MemberInfoDialog
          memberInfo={selectedMember}
          show={showMemberInfoDialog}
          onClose={handleCloseInfoDialog}
          onConfirmUpdate={handleConfirmUpdate}
          confirmErr={confirmError}
          confirmMessage={confirmMsg}
        />
      ) : (
        ''
      )}
    </>
  );
}

export default Search;
