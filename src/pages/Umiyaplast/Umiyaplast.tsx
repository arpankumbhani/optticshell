import { useState } from "react";
import UserProfileTab from "../../components/Umiyaplast/UserProfileTab";
import AdvancedTab from "../../components/Umiyaplast/AdvancedTab";
import AccessTab from "../../components/Umiyaplast/AccessTab";
import ActionsTab from "../../components/Umiyaplast/ActionsTab";

export default function Umiyaplast() {
    const [activeTab, setActiveTab] = useState("User Profile");

    const tabs = ["User Profile", "Advanced", "Access", "Actions"];

    const renderTabContent = () => {
        switch (activeTab) {
            case "User Profile":
                return <UserProfileTab />;
            case "Advanced":
                return <AdvancedTab />;
            case "Access":
                return <AccessTab />;
            case "Actions":
                return <ActionsTab />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="p-6 ml-2">
                <div className="text-[#191B1C] font-medium py-2">Umiyaplast</div>
            </div>
            <div className="px-6 ml-2">
                <div className="border border-gray-200 bg-[#ffff] rounded-lg">
                    <div className="flex space-x-6 pl-5 pt-2 border-b border-[#EDEFFE]">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-2 text-sm font-medium ${activeTab === tab
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-600 hover:text-blue-600"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </>
    );
}
