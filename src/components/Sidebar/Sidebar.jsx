import React, { useContext, useState, useEffect, useCallback } from 'react';
import './sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHistory, faQuestionCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../../context/Context';

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false);
    const { onSent, prevPrompts, setRecentPrompt } = useContext(Context);
    const [activePrompt, setActivePrompt] = useState(null);

    useEffect(() => {
        const storedState = localStorage.getItem("sidebarExpanded");
        if (storedState) {
            setExpanded(JSON.parse(storedState));
        }
    }, []);

    const toggleSidebar = () => {
        setExpanded((prev) => {
            const newState = !prev;
            localStorage.setItem("sidebarExpanded", JSON.stringify(newState));
            return newState;
        });
    };

    const loadPrompt = useCallback(async (prompt) => {
        setRecentPrompt(prompt);
        setActivePrompt(prompt);
        await onSent(prompt);
    }, [setRecentPrompt, onSent]);

    return (
        <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
            {/* Sidebar Top Section */}
            <div className="top">
                {/* Menu Toggle Button (No Rotation) */}
                <div className='bottom-item'><FontAwesomeIcon
                    icon={faBars}
                    className="menu-icon"
                    onClick={toggleSidebar}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => e.key === "Enter" && toggleSidebar()}
                />
                {expanded && <p>Menu</p>}
                </div>

                {/* Recent Chats List */}
                {expanded && (
                    <div className="recent">
                        <p className="recent-title">Recent Prompts</p>
                        {prevPrompts.length > 0 ? (
                            prevPrompts.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => loadPrompt(item)}
                                    className={`recent-entry ${activePrompt === item ? 'active' : ''}`}
                                >
                                    <FontAwesomeIcon icon={faHistory} />
                                    <p>{item.length > 20 ? item.slice(0, 20) + "..." : item}</p>
                                </div>
                            ))
                        ) : (
                            <p className="empty-text">No recent prompts</p>
                        )}
                    </div>
                )}
            </div>

            {/* Sidebar Bottom Section */}
            <div className="bottom">
                <div className="bottom-item">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    {expanded && <p>Help</p>}
                </div>
                <div className="bottom-item">
                    <FontAwesomeIcon icon={faHistory} />
                    {expanded && <p>Activity</p>}
                </div>
                <div className="bottom-item">
                    <FontAwesomeIcon icon={faCog} />
                    {expanded && <p>Settings</p>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
