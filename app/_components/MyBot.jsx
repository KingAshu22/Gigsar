import { lazy, Suspense, useEffect, useState } from "react";
const ChatBot = lazy(() => import("react-chatbotify"));

const MyBot = () => {
  const [form, setForm] = useState({});
  const formStyle = {
    marginTop: 10,
    marginLeft: 20,
    border: "1px solid #491d8d",
    padding: 10,
    borderRadius: 5,
    maxWidth: 300,
  };

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const options = {
    // Configurations Category
    theme: {
      primaryColor: "#f44336",
      secondaryColor: "#202124",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', " +
        "'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', " +
        "sans-serif",
      showHeader: true,
      showFooter: false,
      showInputRow: true,
      actionDisabledIcon:
        "https://gigsar.s3.ap-south-1.amazonaws.com/icons/action+disabled.png",
      embedded: false,
      desktopEnabled: true,
      mobileEnabled: true,
      flowStartTrigger: "ON_LOAD",
    },
    tooltip: {
      mode: "CLOSE",
      text: "Talk to me! 😊",
    },
    chatButton: {
      icon: "https://gigsar.s3.ap-south-1.amazonaws.com/icons/message.png",
    },
    header: {
      title: <h3>Gigsar Chatbot</h3>,
      showAvatar: true,
      avatar: "https://gigsar.s3.ap-south-1.amazonaws.com/icons/botAvatar.png",
      closeChatIcon:
        "https://gigsar.s3.ap-south-1.amazonaws.com/icons/closeChat.png",
    },
    notification: {
      disabled: false,
      defaultToggledOn: true,
      volume: 1,
      icon: "https://gigsar.s3.ap-south-1.amazonaws.com/icons/notificationIcon.png",
      sound:
        "https://gigsar.s3.ap-south-1.amazonaws.com/icons/notification-sound.mp3",
      showCount: true,
    },
    audio: {
      disabled: false,
      defaultToggledOn: true,
      tapToPlay: true,
      language: "en-IN",
      voiceNames: ["Google हिंदी"],
      rate: 1,
      volume: 1,
      icon: "https://gigsar.s3.ap-south-1.amazonaws.com/icons/audioIcon.png",
    },
    chatHistory: {
      disabled: false,
      maxEntries: 30,
      storageKey: "rcb-history",
      viewChatHistoryButtonText: "Load Chat History ⟳",
      chatHistoryLineBreakText: "----- Previous Chat History -----",
      autoLoad: false,
    },
    chatInput: {
      disabled: false,
      allowNewline: false,
      enabledPlaceholderText: "Type your message...",
      disabledPlaceholderText: "",
      showCharacterCount: false,
      characterLimit: -1,
      botDelay: 1000,
      sendButtonIcon:
        "https://gigsar.s3.ap-south-1.amazonaws.com/icons/sendIcon.png",
      blockSpam: true,
      sendOptionOutput: true,
      sendCheckboxOutput: true,
      sendAttachmentOutput: true,
    },
    chatWindow: {
      showScrollbar: false,
      autoJumpToBottom: false,
      showMessagePrompt: true,
      messagePromptText: "New Messages ↓",
      messagePromptOffset: 30,
    },
    sensitiveInput: {
      maskInTextArea: true,
      maskInUserBubble: true,
      asterisksCount: 10,
      hideInUserBubble: false,
    },
    userBubble: {
      animate: true,
      showAvatar: false,
      avatar: "https://gigsar.s3.ap-south-1.amazonaws.com/icons/userAvatar.png",
      simStream: true,
      streamSpeed: 30,
      dangerouslySetInnerHtml: false,
    },
    botBubble: {
      animate: true,
      showAvatar: false,
      avatar: "https://gigsar.s3.ap-south-1.amazonaws.com/icons/botAvatar.png",
      simStream: true,
      streamSpeed: 50,
      dangerouslySetInnerHtml: false,
    },
    emoji: {
      disabled: false,
      icon: "https://gigsar.s3.ap-south-1.amazonaws.com/icons/emojiIcon.png",
      list: [
        "😀",
        "😃",
        "😄",
        "😅",
        "😊",
        "😌",
        "😇",
        "🙃",
        "🤣",
        "😍",
        "🥰",
        "🥳",
        "🎉",
        "🎈",
        "🚀",
        "⭐️",
      ],
    },
    advance: {
      useCustomMessages: false,
      useCustomBotOptions: false,
      useCustomPaths: false,
    },

    // Styles Category
    tooltipStyle: {},
    chatButtonStyle: {},
    notificationBadgeStyle: {},
    chatWindowStyle: {},
    headerStyle: {},
    bodyStyle: {},
    chatInputContainerStyle: {},
    chatInputAreaStyle: {},
    chatInputAreaFocusedStyle: {},
    chatInputAreaDisabledStyle: {},
    userBubbleStyle: {},
    botBubbleStyle: {},
    botOptionStyle: {},
    botOptionHoveredStyle: {},
    botCheckboxRowStyle: {},
    botCheckboxNextStyle: {},
    botCheckMarkStyle: {},
    botCheckMarkSelectedStyle: {},
    sendButtonStyle: {},
    sendButtonHoveredStyle: {},
    characterLimitStyle: {},
    characterLimitReachedStyle: {},
    chatHistoryButtonStyle: {},
    chatHistoryButtonHoveredStyle: {},
    chatHistoryLineBreakStyle: {},
    chatMessagePromptStyle: {},
    chatMessagePromptHoveredStyle: {},
    footerStyle: {},
    loadingSpinnerStyle: {},
  };

  const flow = {
    start: {
      message: "Hello there! What is your name?",
      function: (params) => setForm({ ...form, name: params.userInput }),
      path: "ask_number",
    },
    ask_number: {
      message: (params) =>
        `${params.userInput}, provide me your contact number`,
      function: (params) => setForm({ ...form, name: params.userInput }),
      path: "ask_artist",
    },
    ask_artist: {
      message: "What are you looking for?",
      options: ["Singer/Band", "Musician", "DJ"],
      chatDisabled: true,
      function: (params) => setForm({ ...form, artistType: params.userInput }),
      path: "ask_event",
    },
    ask_event: {
      message: "Select your event type:",
      options: ["Wedding", "Corprorate", "House Party", "Private", "Corporate"],
      chatDisabled: true,
      function: (params) => setForm({ ...form, eventType: params.userInput }),
      path: "ask_city",
    },
    ask_city: {
      message: "Provide your event city?",
      function: (params) => setForm({ ...form, city: params.userInput }),
      path: "ask_budget",
    },
    ask_city: {
      message: "Provide your budget?",
      function: (params) => setForm({ ...form, budget: params.userInput }),
      path: "end",
    },
    end: {
      message: "Thank you for your interest, we will get back to you shortly!",
      render: (
        <div style={formStyle}>
          <p>Name: {form.name}</p>
          <p>Artist Type: {form.artistType}</p>
          <p>Event Type: {form.eventType}</p>
          <p>City: {form.city}</p>
          <p>Budget: {form.budget}</p>
        </div>
      ),
      options: ["New Enquiry"],
      chatDisabled: true,
      path: "start",
    },
  };

  return (
    <>
      {isLoaded && (
        <Suspense fallback={<div>Loading...</div>}>
          <ChatBot options={options} flow={flow} />
        </Suspense>
      )}
    </>
  );
};

export default MyBot;
