/**
 * v0 by Vercel.
 * @see https://v0.dev/t/5Mga1Evrecc
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from '@mui/base/Input';
import { Button } from '@mui/material';

import { Checkbox } from '@mui/material/Checkbox';
import Avatar from 'boring-avatars';
import {
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Typography as CardTitle,
} from '@mui/material';
import FilterIcon from '@mui/icons-material/FilterAlt';

export default function Newsearch() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <h1 className="mb-6 text-3xl font-bold md:mb-8 md:text-4xl">
        Member Directory
      </h1>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        Explore our directory of members and connect with the community.
      </p>
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-start md:items-center gap-4">
        <Input className="w-12" placeholder="Search members..." type="search" />
        <div className="flex items-center gap-4">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <FilterIcon className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2">
              <DropdownMenuLabel>Filter by:</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>
                <Checkbox />
                Location{'\n                      '}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <Checkbox />
                Industry{'\n                      '}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <Checkbox />
                Role{'\n                      '}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <ListOrderedIcon className="w-4 h-4 mr-2" />
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2">
              <DropdownMenuLabel>Sort by:</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup defaultValue="name">
                <DropdownMenuRadioItem value="name">
                  Name (A-Z)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="email">
                  Email (A-Z)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date">
                  Date joined (newest)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="flex flex-col">
          <div className="flex items-center gap-4 p-4">
            <Avatar
              size={40}
              name="Maria Mitchell"
              variant="bauhaus"
              colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
            />

            <div className="flex-1">
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                john@example.com
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Youth Pastor
              </div>
            </div>
          </div>
        </Card>
        <Card className="flex flex-col">
          <div className="flex items-center gap-4 p-4">
            <Avatar
              size={40}
              name="Maria Mitchell"
              variant="bauhaus"
              colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
            />

            <div className="flex-1">
              <div className="font-medium">Jane Doe</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                jane@example.com
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Children's Ministry Coordinator
              </div>
            </div>
          </div>
        </Card>
        <Card className="flex flex-col">
          <div className="flex items-center gap-4 p-4">
            <Avatar
              size={40}
              name="Maria Mitchell"
              variant="bauhaus"
              colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
            />

            <div className="flex-1">
              <div className="font-medium">Bob Smith</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                bob@example.com
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Worship Leader
              </div>
            </div>
          </div>
        </Card>
        <Card className="flex flex-col">
          <div className="flex items-center gap-4 p-4">
            <Avatar
              size={40}
              name="Maria Mitchell"
              variant="bauhaus"
              colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
            />

            <div className="flex-1">
              <div className="font-medium">Sarah Lee</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                sarah@example.com
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Small Group Leader
              </div>
            </div>
          </div>
        </Card>
        <Card className="flex flex-col">
          <div className="flex items-center gap-4 p-4">
            <Avatar
              size={40}
              name="Maria Mitchell"
              variant="bauhaus"
              colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
            />

            <div className="flex-1">
              <div className="font-medium">Michael Johnson</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                michael@example.com
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Usher
              </div>
            </div>
          </div>
        </Card>
        <Card className="flex flex-col">
          <div className="flex items-center gap-4 p-4">
            <Avatar
              size={40}
              name="Maria Mitchell"
              variant="ring"
              colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
            />

            <div className="flex-1">
              <div className="font-medium">Emily Davis</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                emily@example.com
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Greeter
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ListOrderedIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}
