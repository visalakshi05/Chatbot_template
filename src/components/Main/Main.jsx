import './main.css';
import user from "../../assets/user.avif";
import React, { useContext, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone, faImage, faRobot, faCompass, faLightbulb, faComments, faCode } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../../context/Context';
import Tesseract from 'tesseract.js';

const Main = () => {
    const { onSent, showResult, loading, messages, setInput, input } = useContext(Context);
    const chatRef = useRef(null);

    // Scroll to bottom when new message appears
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            onSent();
        }
    };

    // Image to Text Extraction
    const extractTextFromImage = async (file) => {
        try {
            const { data: { text } } = await Tesseract.recognize(file, 'eng');
            const extractedText = text.trim();
            if (extractedText) {
                setInput(extractedText); // Update input field
                setTimeout(() => {
                    onSent(); // Send extracted text after update
                }, 100);
            }
        } catch (error) {
            console.error("Error extracting text from image:", error);
        }
    };

    // Handle image selection
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            extractTextFromImage(file);
        }
    };

    return (
        <div className="main">
            <div className="nav">
                <p>Chatbot</p>
                <img src={user} alt="User" className="user-avatar" onError={(e) => e.target.style.display = 'none'} />
            </div>

            <div className="main-container">
                {
                    !showResult ? (
                        <>
                            {/* Greeting Message */}
                            <div className="greet">
                                <p><span>Hello, there!</span></p>
                                <p>How can I help you?</p>
                            </div>

                            {/* Suggestion Cards */}
                            <div className="cards">
                                <div className="card" onClick={() => onSent("Suggest beautiful places to see on an upcoming road trip")}>
                                    <p>Suggest beautiful places to see on upcoming road trip</p>
                                    <FontAwesomeIcon icon={faCompass} size="2x" />
                                </div>
                                <div className="card" onClick={() => onSent("Briefly summarize this text: Urban Planning")}>
                                    <p>Briefly summarize this text: Urban Planning</p>
                                    <FontAwesomeIcon icon={faLightbulb} size="2x" />
                                </div>
                                <div className="card" onClick={() => onSent("Brainstorm team bonding activities for our work retreat")}>
                                    <p>Brainstorm team bonding activities for our work retreat</p>
                                    <FontAwesomeIcon icon={faComments} size="2x" />
                                </div>
                                <div className="card" onClick={() => onSent("Improve the readability of the following code")}>
                                    <p>Improve the readability of the following code</p>
                                    <FontAwesomeIcon icon={faCode} size="2x" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='result' ref={chatRef}>
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender}`}>
                                    {msg.sender === "bot" && <FontAwesomeIcon icon={faRobot} size="lg" />}
                                    <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                                </div>
                            ))}
                            {loading && (
                                <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            )}
                        </div>
                    )
                }

                {/* Input Section */}
                <div className="main-bottom">
                    <div className="search-box">
                        <input 
                            onChange={(e) => setInput(e.target.value)} 
                            value={input} 
                            type='text' 
                            placeholder='Enter a prompt here'
                            onKeyDown={handleKeyDown} 
                        />
                        <div>
                            {/* 
                            <label>
                                <FontAwesomeIcon icon={faImage} size="lg" />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                    style={{ display: 'none' }} 
                                />
                            </label>

                            <FontAwesomeIcon icon={faMicrophone} size="lg" />*/}
                            {input && <FontAwesomeIcon icon={faPaperPlane} size="lg" onClick={() => onSent()} />}
                        </div>
                    </div>
                    <p className="bottom-info">
                        This chatbot may display inaccurate info, including about people, so double-check the responses.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Main;
