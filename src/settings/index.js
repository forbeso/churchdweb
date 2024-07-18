import {
  Card,
  CardContent,
  CardActionArea,
  CardHeader,
  Typography as CardTitle,
  Button,
  Checkbox,
  Input,
} from '@mui/material';
import Switch from '@mui/material/Switch';

export default function Settings() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader
          title="Account"
          subheader="Manage your account settings."
        ></CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <Input id="name" placeholder="Your name" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is the name that will be displayed on your profile.
              </p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="Your email" />
              <p className="text-sm text-gray-500">
                This is the email associated with your account.
              </p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
              />
              <p className="text-sm text-gray-500">
                You can change your password here.
              </p>
            </div>
          </div>
        </CardContent>
        <CardActionArea className="border-t p-3">
          <Button className="bg-dark text-white">Save Changes</Button>
        </CardActionArea>
      </Card>
      <Card>
        <CardHeader
          title="Notifications"
          subheader="Manage your notification settings."
        ></CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="email-notifications" />
              <label htmlFor="email-notifications">Email Notifications</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="push-notifications" />
              <label htmlFor="push-notifications">Push Notifications</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sms-notifications" />
              <label htmlFor="sms-notifications">SMS Notifications</label>
            </div>
          </div>
        </CardContent>
        <CardActionArea className="border-t p-3">
          <Button>Save Changes</Button>
        </CardActionArea>
      </Card>
      <Card>
        <CardHeader
          title="Privacy"
          subheader="Manage your privacy settings."
        ></CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="public-profile" />
              <label htmlFor="public-profile">Public Profile</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="share-data" />
              <label htmlFor="share-data">Share Data with Third Parties</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="receive-emails" />
              <label htmlFor="receive-emails">Receive Promotional Emails</label>
            </div>
          </div>
        </CardContent>
        <CardActionArea className="border-t p-3">
          <Button>Save Changes</Button>
        </CardActionArea>
      </Card>
    </div>
  );
}
