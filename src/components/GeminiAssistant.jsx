import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, Trash2, Settings, Key, Check } from 'lucide-react';

const STATIC_RESPONSES = {
  accessibility: `**Gemini AI Accessibility Response (MetLife Stadium)**:
1. **Gate Entrance**: Use **Plaza Gate A**, which is fully equipped with ADA-compliant ramps and wide automatic turnstiles.
2. **Elevator Route**: From Gate A, head straight 45 meters towards the West elevator bank (next to Concession 104).
3. **Elevator Access**: Take Elevator 3 to Level 2.
4. **Seat Section**: Exit Elevator 3 and turn right. Section 101 wheelchair seating is on Row ADA directly ahead.
5. **Operational Alert**: Assistive listening devices and sensory bags are available at Guest Services at Section 124.`,
  
  translate: `**Gemini AI Multilingual Assistance**:
The phrase **"I lost my seat ticket, who should I contact?"** translated:
- **Spanish**: "Perdí mi boleto de asiento, ¿con quién debo comunicarme?"
- **French**: "J'ai perdu mon billet de siège, qui dois-je contacter?"
- **Arabic**: "لقد فقدت تذكرة مقعدي، بمن يجب أن أتصل؟"
- **German**: "Ich habe mein Sitzplatzticket verloren, an wen soll ich mich wenden?"
- **Portuguese**: "Perdi meu ingresso do assento, quem devo contatar?"
- **Japanese**: "座席のチケットを紛失しました。誰に連絡すればいいですか？"

*Tip for Volunteers: Point the fan to the nearest Guest Services booth (located at Section 108 or 210) for instant ticket re-printing.*`,
  
  emergency: `**Gemini AI Crisis Management Script (Extreme Heat Alert)**:
[INTENDED FOR PUBLIC ANNOUNCEMENT & DIGITAL SIGNAGE]

"Attention all FIFA World Cup 2026 fans and guests. Due to high temperatures in the stadium area, we advise taking the following safety precautions:
1. **Hydration**: Free water refill stations are active at Section 103, 116, 204, and 232. Reusable cups are permitted.
2. **Cooling Zones**: Shaded cooling zones with air-conditioning are open in Plaza Concourse B and VIP Lounge East.
3. **Medical Aid**: If you or anyone around you feels dizzy or fatigued, please report to the nearest volunteer in green vests or head to the Medical Station at Section 109.

Thank you for your cooperation. Stay safe and enjoy the match."`,
  
  sustainability: `**Gemini AI Sustainability Report & Optimization**:
1. **Concession Packaging**: Recommend transition from bioplastic cups to aluminum cups for MetLife Stadium, increasing physical recycling capture rate by **38%**.
2. **HVAC Dynamic Cooling**: Based on gate ticket scans (Zone B currently at 45% capacity), HVAC cooling should be scaled back by **15%** in Zone B suites, saving **1,200 kWh** during the first half.
3. **Fan Incentive**: Broadcast the 'Green Fan Challenge' via the app. Fans who scan 3 recyclables at the AI Reverse Vending machines receive a **15% discount** code at the official FIFA store.`,
  
  halal: `**Gemini AI Concessions Guide**:
For Halal and Gluten-Free food options near Section 100-200:
1. **Concession 112 (Global Bites)**: Certified Halal Chicken Gyros and Falafel Wraps (Vegan, Gluten-free wraps available on request).
2. **Concession 205 (Oasis Grill)**: Halal Beef Kebabs and Hummus platters.
3. **Policy**: All certified Halal stations use separate utensils and prep areas. Gluten-free snacks are also available at the Grab-and-Go kiosk at Section 115.`,
  
  transit: `**Gemini AI Transit Optimization**:
Current rail queue at Meadowlands Station is **22 minutes**.
**AI Advice**: 
- Advise passengers heading to Manhattan to take the **Express shuttle bus (Bay 4)** instead. Buses depart every 4 minutes and have a current wait time of only **5 minutes**. 
- Carpool EV parking zones at Lot E have **40 open slots** with free charging available.`
};

export default function GeminiAssistant({ activeStadium, activeRole }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello! I am ArenaAI, your Generative AI assistant for the FIFA World Cup 2026. 
How can I assist you today? Feel free to ask about accessibility routes, real-time translations, emergency scripts, crowd rerouting, or sustainability measures.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    try {
      return (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('arenapulse_gemini_api_key')) || '';
    } catch (e) {
      return '';
    }
  });
  const [keySaved, setKeySaved] = useState(false);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const saveApiKey = (e) => {
    e.preventDefault();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('arenapulse_gemini_api_key', apiKey.trim());
      }
    } catch (err) {}
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowSettings(false);
    }, 1200);
  };

  const callRealGemini = async (promptText) => {
    let key = '';
    try {
      key = (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('arenapulse_gemini_api_key')) || '';
    } catch (e) {}
    if (!key) return null;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are ArenaAI, a real-time smart stadium and operations coordinator for the FIFA World Cup 2026.
Active Stadium Location: ${activeStadium}
User Role Interface: ${activeRole}

User Request: "${promptText}"

Respond clearly, concisely, and keep the answer formatted in standard markdown with bold elements for readability. Avoid extra pleasantries.`
                  }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API error code ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (err) {
      console.error('Gemini API Error:', err);
      return `**Gemini API Connection Error**: ${err.message}. Falling back to simulated local database.`;
    }
  };

  const triggerResponse = async (type, queryText) => {
    setIsTyping(true);

    // Try calling real Gemini API first if API key is provided
    const realResponse = await callRealGemini(queryText);
    
    if (realResponse) {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 2,
          sender: 'assistant',
          text: realResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
      return;
    }

    // Fallback to simulated response
    setTimeout(() => {
      let responseText = '';
      if (STATIC_RESPONSES[type]) {
        responseText = STATIC_RESPONSES[type];
      } else {
        const query = queryText.toLowerCase();
        if (query.includes('accessibility') || query.includes('wheelchair') || query.includes('disabled')) {
          responseText = `**Gemini AI Accessibility Routing Assistance**:
- **Stadium**: ${activeStadium}
- **Ramps**: Ramps are located at Gates A, B, and D.
- **Elevators**: East and West elevators have priority for fans with mobility challenges. 
- **Restrooms**: Accessible companion restrooms are available in every concourse level, spaced every 50 meters.
- **AI Recommendation**: Please inform the nearest volunteer (in green) if you need a golf cart shuttle from the outer parking lot.`;
        } else if (query.includes('translate') || query.includes('spanish') || query.includes('french') || query.includes('arabic') || query.includes('language')) {
          responseText = STATIC_RESPONSES.translate;
        } else if (query.includes('emergency') || query.includes('heat') || query.includes('evacuate') || query.includes('weather') || query.includes('rain')) {
          responseText = STATIC_RESPONSES.emergency;
        } else if (query.includes('sustainability') || query.includes('carbon') || query.includes('recycle') || query.includes('green')) {
          responseText = STATIC_RESPONSES.sustainability;
        } else if (query.includes('food') || query.includes('eat') || query.includes('halal') || query.includes('kosher') || query.includes('gluten')) {
          responseText = STATIC_RESPONSES.halal;
        } else if (query.includes('transit') || query.includes('bus') || query.includes('train') || query.includes('metro') || query.includes('car')) {
          responseText = STATIC_RESPONSES.transit;
        } else {
          responseText = `**Gemini AI Virtual Assistant**:
Thank you for your query: "${queryText}".
I am currently acting as the operations support assistant for **${activeStadium}** under the **${activeRole}** dashboard.

Here is a live summary:
- **Crowd flow**: Optimized gates are Gates A and C.
- **Concessions**: Restroom lines are shortest on Section 107.
- **Safety**: No critical alarms are active. Volunteers are stationed at 50-meter intervals on all concourses.

For specialized answers, try asking about **accessibility routes**, **halal food**, **emergency announcements**, or **public transit options**.`;
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 2,
          sender: 'assistant',
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'user',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
    triggerResponse('custom', userText);
  };

  const handleQuickPrompt = (promptType, label) => {
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'user',
        text: `[Scenario Run]: ${label}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    triggerResponse(promptType, label);
  };

  const clearChat = () => {
    if (window.confirm('Clear conversation history?')) {
      setMessages([
        {
          id: 1,
          sender: 'assistant',
          text: 'Chat history cleared. How can I assist you with stadium operations or fan logistics?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const formatText = (text) => {
    return text.split('\n').map((line, index) => {
      let isBullet = false;
      
      if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
        isBullet = true;
      }
      
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} style={{ color: 'var(--accent-cyber)' }}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <div key={index} style={{ 
          marginBottom: '6px', 
          paddingLeft: isBullet ? '12px' : '0px',
          textIndent: isBullet ? '-12px' : '0'
        }}>
          {parts.length > 0 ? parts : line}
        </div>
      );
    });
  };

  return (
    <div className="glass-card glow-indigo" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div className="card-title-bar">
        <h3>
          <Bot size={18} style={{ color: 'var(--accent-ai)', filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.6))' }} />
          ArenaAI Copilot
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            style={{ background: 'transparent', border: 'none', color: showSettings ? 'var(--accent-cyber)' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Configure Gemini API Settings"
            aria-label="Toggle Gemini API Key configuration Settings"
          >
            <Settings size={16} />
          </button>
          <button 
            onClick={clearChat}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Clear chat history"
            aria-label="Clear chat history log"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Settings Drawer */}
      {showSettings && (
        <form onSubmit={saveApiKey} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="api-key-input" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Key size={12} /> Google Gemini API Key:
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input 
                id="api-key-input"
                type="password" 
                className="form-input" 
                style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem' }}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {keySaved ? <Check size={14} /> : 'Save'}
              </button>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Key is stored locally in your browser's localStorage and used direct client-side.
            </span>
          </div>
        </form>
      )}

      <div className="chat-container">
        <div 
          className="chat-history" 
          ref={chatHistoryRef} 
          role="log" 
          aria-live="polite" 
          aria-label="ArenaAI Conversation Chat Log"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`chat-bubble ${msg.sender}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 'bold', color: msg.sender === 'user' ? '#a5b4fc' : '#94a3b8' }}>
                {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} style={{ color: 'var(--accent-ai)' }} />}
                {msg.sender === 'user' ? 'You' : 'Gemini AI Assistant'}
                <span style={{ fontWeight: 'normal', color: '#64748b', marginLeft: 'auto' }}>{msg.time}</span>
              </div>
              <div className="chat-bubble-inner">
                {formatText(msg.text)}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble assistant" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={12} style={{ color: 'var(--accent-ai)' }} />
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Analyzing stadium logistics</span>
              <span className="typist-cursor" aria-hidden="true"></span>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="chat-input-bar">
          <label htmlFor="chat-query-input" className="form-label" style={{ display: 'none' }}>Ask a question</label>
          <input 
            id="chat-query-input"
            type="text" 
            className="chat-input" 
            placeholder={`Ask ArenaAI for ${activeStadium}...`} 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="chat-send-btn" 
            disabled={isTyping || !inputText.trim()}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      <div>
        <p style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px' }}>
          Interactive AI Training Prompt Scenarios:
        </p>
        <div className="quick-prompts-grid" role="group" aria-label="Quick AI prompt options">
          <button 
            type="button" 
            className="quick-prompt-card"
            onClick={() => handleQuickPrompt('accessibility', 'Wheelchair ADA navigation route')}
            disabled={isTyping}
            aria-label="Analyze Section 101 wheelchair route"
          >
            ♿ <strong>Accessibility Path</strong>
            <p style={{ fontSize: '0.70rem', color: '#64748b', marginTop: '2px' }}>MetLife Sec 101 wheelchair ramp & lift guide.</p>
          </button>
          <button 
            type="button" 
            className="quick-prompt-card"
            onClick={() => handleQuickPrompt('translate', 'Multilingual Translation Help')}
            disabled={isTyping}
            aria-label="Demos multilingual ticket help translations"
          >
            🗣️ <strong>Multilingual Translator</strong>
            <p style={{ fontSize: '0.70rem', color: '#64748b', marginTop: '2px' }}>Translate ticket help inquiries into 6 languages.</p>
          </button>
          <button 
            type="button" 
            className="quick-prompt-card"
            onClick={() => handleQuickPrompt('emergency', 'Crisis extreme heat warning script')}
            disabled={isTyping}
            aria-label="Generate extreme heat crisis announcement"
          >
            🚨 <strong>Extreme Heat Alert PA</strong>
            <p style={{ fontSize: '0.70rem', color: '#64748b', marginTop: '2px' }}>Generate stadium cooling and hydration script.</p>
          </button>
          <button 
            type="button" 
            className="quick-prompt-card"
            onClick={() => handleQuickPrompt('sustainability', 'Concessions waste optimization')}
            disabled={isTyping}
            aria-label="Analyze concession waste optimization"
          >
            ♻️ <strong>Eco-Energy Savings</strong>
            <p style={{ fontSize: '0.70rem', color: '#64748b', marginTop: '2px' }}>AI HVAC dynamic load suggestions & recycling incentive.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
