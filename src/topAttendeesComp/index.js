import Avatar from 'boring-avatars';

export default function TopAttendeesComp() {
  return (
    <div className="bg-[#f8f8f8] rounded-lg shadow-lg p-6 animate__animated animate__fadeInUp overflow-x-scroll">
      <h2 className="text-2xl font-bold mb-4 text-[#4a4a4a]">Top Attendees</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[#4a4a4a]">
          <thead>
            <tr className="bg-[#e6f2ff] text-left">
              <th className="px-4 py-3 rounded-tl-lg">Event</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 rounded-tr-lg">Top Attendees</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#d9d9d9] hover:bg-[#f2f2f2]">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#ffdede] flex items-center justify-center mr-3">
                    <CalendarIcon className="w-5 h-5 text-[#ff6b6b]" />
                  </div>
                  <span>Easter Praise Fest</span>
                </div>
              </td>
              <td className="px-4 py-3">April 4, 2023</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <Avatar
                    size={30}
                    name="hel"
                    variant="beam"
                    colors={[
                      '#92A1C6',
                      '#146A7C',
                      '#F0AB3D',
                      '#C271B4',
                      '#C20D90',
                    ]}
                  />
                  <Avatar
                    size={30}
                    name="hel"
                    variant="beam"
                    colors={[
                      '#92A1C6',
                      '#146A7C',
                      '#F0AB3D',
                      '#C271B4',
                      '#C20D90',
                    ]}
                  />
                  <Avatar
                    size={30}
                    name="b"
                    variant="beam"
                    colors={[
                      '#92A1C6',
                      '#146A7C',
                      '#F0AB3D',
                      '#C271B4',
                      '#C20D90',
                    ]}
                  />
                </div>
              </td>
            </tr>
            <tr className="border-b border-[#d9d9d9] hover:bg-[#f2f2f2]">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#e6f2ff] flex items-center justify-center mr-3">
                    <GiftIcon className="w-5 h-5 text-[#007bff]" />
                  </div>
                  <span>Christmas Celebration</span>
                </div>
              </td>
              <td className="px-4 py-3">December 25, 2025</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <Avatar
                    size={30}
                    name="a"
                    variant="beam"
                    colors={[
                      '#92A1C6',
                      '#146A7C',
                      '#F0AB3D',
                      '#C271B4',
                      '#C20D90',
                    ]}
                  />
                </div>
              </td>
            </tr>
            <tr className="border-b border-[#d9d9d9] hover:bg-[#f2f2f2]">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#f2f2ff] flex items-center justify-center mr-3">
                    <HeartIcon className="w-5 h-5 text-[#9b59b6]" />
                  </div>
                  <span>Valentine's Day Celebration</span>
                </div>
              </td>
              <td className="px-4 py-3">December 14, 2024</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <Avatar
                    size={30}
                    name="hll"
                    variant="beam"
                    colors={[
                      '#92A1C6',
                      '#146A7C',
                      '#F0AB3D',
                      '#C271B4',
                      '#C20D90',
                    ]}
                  />
                  <Avatar
                    size={30}
                    name="Ma"
                    variant="beam"
                    colors={[
                      '#92A1C6',
                      '#146A7C',
                      '#F0AB3D',
                      '#C271B4',
                      '#C20D90',
                    ]}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CalendarIcon(props) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function GiftIcon(props) {
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
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function HeartIcon(props) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
