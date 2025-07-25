import React from 'react';
import TasksWidget from './TasksWidget';
import GmailWidget from './GmailWidget';
import GoogleDriveWidget from './GoogleDriveWidget';
import MyListsWidget from './MyListsWidget';
import CalendarWidget from './CalendarWidget';
import DocumentsWidget from './DocumentsWidget';
import CameraWidget from './CameraWidget';
import AIAssistantWidget from './AIAssistantWidget';

function Dashboard({ healthStatus, refreshTasks, onTaskAdded }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ChatGPT-Google Dashboard
          </h1>
          <a 
            href="https://chat.openai.com" 
            target="_blank"
            rel="noopener noreferrer"
            title="Open ChatGPT"
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 721 721" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1637_2934)">
                <g clipPath="url(#clip1_1637_2934)">
                  <path d="M304.246 294.611V249.028C304.246 245.189 305.687 242.309 309.044 240.392L400.692 187.612C413.167 180.415 428.042 177.058 443.394 177.058C500.971 177.058 537.44 221.682 537.44 269.182C537.44 272.54 537.44 276.379 536.959 280.218L441.954 224.558C436.197 221.201 430.437 221.201 424.68 224.558L304.246 294.611ZM518.245 472.145V363.224C518.245 356.505 515.364 351.707 509.608 348.349L389.174 278.296L428.519 255.743C431.877 253.826 434.757 253.826 438.115 255.743L529.762 308.523C556.154 323.879 573.905 356.505 573.905 388.171C573.905 424.636 552.315 458.225 518.245 472.141V472.145ZM275.937 376.182L236.592 353.152C233.235 351.235 231.794 348.354 231.794 344.515V238.956C231.794 187.617 271.139 148.749 324.4 148.749C344.555 148.749 363.264 155.468 379.102 167.463L284.578 222.164C278.822 225.521 275.942 230.319 275.942 237.039V376.186L275.937 376.182ZM360.626 425.122L304.246 393.455V326.283L360.626 294.616L417.002 326.283V393.455L360.626 425.122ZM396.852 570.989C376.698 570.989 357.989 564.27 342.151 552.276L436.674 497.574C442.431 494.217 445.311 489.419 445.311 482.699V343.552L485.138 366.582C488.495 368.499 489.936 371.379 489.936 375.219V480.778C489.936 532.117 450.109 570.985 396.852 570.985V570.989ZM283.134 463.99L191.486 411.211C165.094 395.854 147.343 363.229 147.343 331.562C147.343 294.616 169.415 261.509 203.48 247.593V356.991C203.48 363.71 206.361 368.508 212.117 371.866L332.074 441.437L292.729 463.99C289.372 465.907 286.491 465.907 283.134 463.99ZM277.859 542.68C223.639 542.68 183.813 501.895 183.813 451.514C183.813 447.675 184.294 443.836 184.771 439.997L279.295 494.698C285.051 498.056 290.812 498.056 296.568 494.698L417.002 425.127V470.71C417.002 474.549 415.562 477.429 412.204 479.346L320.557 532.126C308.081 539.323 293.206 542.68 277.854 542.68H277.859ZM396.852 599.776C454.911 599.776 503.37 558.513 514.41 503.812C568.149 489.896 602.696 439.515 602.696 388.176C602.696 354.587 588.303 321.962 562.392 298.45C564.791 288.373 566.231 278.296 566.231 268.224C566.231 199.611 510.571 148.267 446.274 148.267C433.322 148.267 420.846 150.184 408.37 154.505C386.775 133.392 357.026 119.958 324.4 119.958C266.342 119.958 217.883 161.22 206.843 215.921C153.104 229.837 118.557 280.218 118.557 331.557C118.557 365.146 132.95 397.771 158.861 421.283C156.462 431.36 155.022 441.437 155.022 451.51C155.022 520.123 210.682 571.466 274.978 571.466C287.931 571.466 300.407 569.549 312.883 565.228C334.473 586.341 364.222 599.776 396.852 599.776Z" fill="white"/>
                </g>
              </g>
              <defs>
                <clipPath id="clip0_1637_2934">
                  <rect width="720" height="720" fill="white" transform="translate(0.606934 0.0999756)"/>
                </clipPath>
                <clipPath id="clip1_1637_2934">
                  <rect width="484.139" height="479.818" fill="white" transform="translate(118.557 119.958)"/>
                </clipPath>
              </defs>
            </svg>
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <TasksWidget type="work" />
        <TasksWidget type="personal" />
        <GmailWidget />
        <CalendarWidget />
        <GoogleDriveWidget />
        <MyListsWidget />
        <AIAssistantWidget />
        <DocumentsWidget />
        <CameraWidget onCaptureSuccess={onTaskAdded} />
      </div>
    </div>
  );
}

export default Dashboard;