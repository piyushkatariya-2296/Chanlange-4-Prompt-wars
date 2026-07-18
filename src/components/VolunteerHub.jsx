import React, { useState } from 'react';
import { ClipboardList, Languages, AlertCircle, CheckCircle2, User, Globe, AlertTriangle } from 'lucide-react';

const VOLUNTEER_LANGUAGES = [
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'zh', name: 'Chinese (中文)' }
];

const PRESET_QUERIES = [
  {
    id: 'lost_found',
    label: 'Where is the lost and found?',
    translations: {
      es: '¿Dónde está la oficina de objetos perdidos?',
      fr: 'Où se trouve le bureau des objets trouvés?',
      ar: 'أين مكتب المفقودات؟',
      de: 'Wo ist das Fundbüro?',
      ja: '落とし物取扱所はどこですか？',
      pt: 'Onde fica o setor de achados e perdidos?',
      ko: '분실물 보관소는 어디인가요?',
      zh: '失物招领处在哪里？'
    },
    englishResponse: 'Lost and Found is located at Guest Services Section 108. Please escort the fan there.',
    fanResponse: {
      es: 'La oficina de objetos perdidos está en la Sección 108 de Servicios al Huésped. Por favor, acompáñeme.',
      fr: 'Le bureau des objets trouvés est situé à la Section 108 du Service Client. Veuillez m\'accompagner.',
      ar: 'مكتب المفقودات يقع في قسم خدمة الضيوف رقم 108. تفضل معي سأرشدك.',
      de: 'Das Fundbüro befindet sich im Kundenservice-Bereich Sektor 108. Bitte folgen Sie mir.',
      ja: '遺失物取扱所はゲストサービスセクション108にあります。ご案内いたします。',
      pt: 'O setor de achados e perdidos fica na Seção 108 de Serviços ao Visitante. Por favor, venha comigo.',
      ko: '분실물 센터는 고객 서비스 108구역에 있습니다. 저를 따라오세요.',
      zh: '失物招领处位于108区的客户服务处。请跟我来。'
    }
  },
  {
    id: 'ticket_error',
    label: 'My mobile ticket won’t scan at the gate.',
    translations: {
      es: 'Mi boleto móvil no se escanea en la puerta.',
      fr: 'Mon billet mobile ne scanne pas à la porte.',
      ar: 'تذكرتي الإلكترونية لا تعمل عند البوابة.',
      de: 'Mein mobiles Ticket lässt sich am Einlass nicht scannen.',
      ja: 'モバイルチケットがゲートでスキャンできません。',
      pt: 'Meu ingresso digital não está escaneando no portão.',
      ko: '모바일 티켓이 게이트에서 스캔되지 않습니다.',
      zh: '我的电子门票在入口处无法扫描。'
    },
    englishResponse: 'Please guide the fan to the Ticket Resolution Window next to Gate A or Gate C.',
    fanResponse: {
      es: 'Por favor, diríjase a la ventanilla de resolución de boletos junto a la Puerta A o la Puerta C.',
      fr: 'Veuillez vous rendre au guichet de résolution des billets situé à côté de la Porte A ou Porte C.',
      ar: 'من فضلك توجه إلى نافذة حل مشاكل التذاكر بجوار البوابة A أو البوابة C.',
      de: 'Bitte gehen Sie zum Ticket-Klärungsschalter neben Tor A oder Tor C.',
      ja: 'ゲートAまたはゲートCの横にあるチケットトラブル対応窓口へお越しください。',
      pt: 'Por favor, dirija-se à bilheteria de resolução de problemas ao lado do Portão A ou Portão C.',
      ko: '게이트 A 또는 게이트 C 옆에 있는 티켓 해결 창구로 가십시오.',
      zh: '请前往A门或C门旁边的门票处理窗口。'
    }
  },
  {
    id: 'medical_fever',
    label: 'My child feels sick and has a fever.',
    translations: {
      es: 'Mi hijo se siente enfermo y tiene fiebre.',
      fr: 'Mon enfant se sent mal et a de la fièvre.',
      ar: 'طفلي يشعر بالمرض ولديه حمى.',
      de: 'Mein Kind fühlt sich krank und hat Fieber.',
      ja: '子供の体調が悪く、熱があります。',
      pt: 'Meu filho está se sentindo mal e tem febre.',
      ko: '아이가 아프고 열이 납니다.',
      zh: '我的孩子觉得不舒服，在发烧。'
    },
    englishResponse: 'URGENT: Alert Section Medical Station 2 (located at Sec 109). Escort immediately.',
    fanResponse: {
      es: 'Tenemos una estación médica de urgencias en la Sección 109. Le acompañaré de inmediato.',
      fr: 'Nous avons une station médicale à la Section 109. Je vous y accompagne immédiatement.',
      ar: 'لدينا مركز طبي للطوارئ في القسم 109. سأرافقكم إلى هناك فوراً.',
      de: 'Wir haben eine medizinische Hilfestation in Sektor 109. Ich werde Sie sofort dorthin begleiten.',
      ja: 'セクション109に救護室があります。今すぐご案内いたします。',
      pt: 'Temos um posto médico de emergência na Seção 109. Vou acompanhar vocês imediatamente.',
      ko: '109구역에 의무실이 있습니다. 지금 바로 안내해 드리겠습니다.',
      zh: '109区设有医疗救护站。我马上带您去。'
    }
  }
];

export default function VolunteerHub({ tasks, setTasks, activeStadium, onReportIncident }) {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [selectedQueryId, setSelectedQueryId] = useState('lost_found');
  
  // Custom Translation states
  const [customText, setCustomText] = useState('');
  const [translatingCustom, setTranslatingCustom] = useState(false);
  const [customTranslationResult, setCustomTranslationResult] = useState(null);

  // Field Report states
  const [reportCategory, setReportCategory] = useState('Facility');
  const [reportLocation, setReportLocation] = useState('Section 101');
  const [reportDesc, setReportDesc] = useState('');

  const activeQuery = PRESET_QUERIES.find(q => q.id === selectedQueryId);

  const handleTaskStepToggle = (taskId, stepIndex) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newCompletedSteps = task.completedSteps ? [...task.completedSteps] : [];
        if (newCompletedSteps.includes(stepIndex)) {
          return {
            ...task,
            completedSteps: newCompletedSteps.filter(idx => idx !== stepIndex)
          };
        } else {
          return {
            ...task,
            completedSteps: [...newCompletedSteps, stepIndex]
          };
        }
      }
      return task;
    }));
  };

  const handleCompleteTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'completed' } : task
    ));
  };

  const handleTranslateCustom = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;

    setTranslatingCustom(true);
    
    // Simulate Gemini AI dynamic translator
    setTimeout(() => {
      let langName = VOLUNTEER_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'Language';
      setCustomTranslationResult({
        language: langName,
        source: customText,
        translated: `[Simulated Gemini Translation into ${langName}]: "Señor/Señora, por favor siga mis instrucciones. El personal de apoyo se encuentra en camino para asistirle en este sector."`,
        englishTip: 'AI Assist Tip: Show the translated text screen to the fan and point towards the direction of the gate/elevator.'
      });
      setTranslatingCustom(false);
    }, 1000);
  };

  const handleFieldReport = (e) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;

    onReportIncident({
      id: Date.now(),
      type: reportCategory === 'Medical' || reportCategory === 'Security' ? 'danger' : 'warning',
      message: `Field Report: [${reportCategory}] at ${reportLocation}`,
      recommendation: reportDesc
    });

    alert(`Field report logged. Incident has been queued at the Tournament Operations Dashboard for AI decision support dispatch.`);
    setReportDesc('');
  };

  return (
    <div className="dashboard-grid">
      {/* LEFT COLUMN: AI Dispatch Tasks */}
      <div className="glass-card glow-indigo">
        <div className="card-title-bar">
          <h3><ClipboardList size={18} style={{ color: 'var(--accent-ai)' }} /> AI-Allocated Duty Tasks</h3>
          <span style={{ fontSize: '0.8rem', color: '#a5b4fc', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
            Handset Terminal
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '14px' }}>
          Real-time operations tasks assigned to you by ArenaAI. Complete the check steps below.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tasks.length > 0 ? (
            tasks.map(task => {
              const isHigh = task.priority === 'High';
              const isCompleted = task.status === 'completed';
              const steps = task.actionSteps || [
                `Head to assigned coordinate at ${task.description.split('at ').pop() || activeStadium}.`,
                'Verify fans are secure and communicate with local crew.',
                'Mark task complete on volunteer dashboard terminal.'
              ];
              const completedCount = task.completedSteps ? task.completedSteps.length : 0;
              const progressPct = Math.round((completedCount / steps.length) * 100);

              return (
                <div 
                  key={task.id} 
                  className={`task-card ${isHigh ? 'high-priority' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="flex-row-space-between" style={{ marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isHigh ? 'var(--accent-danger)' : '#fff' }}>
                      {task.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8' }}>
                      {progressPct}% Done
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '10px' }}>
                    {task.description}
                  </p>

                  {/* Steps Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px', background: 'rgba(255,255,255,0.01)', padding: '8px', borderRadius: '6px' }}>
                    {steps.map((step, index) => {
                      const stepChecked = task.completedSteps?.includes(index) || false;
                      return (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isCompleted ? 0.6 : 1 }}>
                          <input 
                            type="checkbox" 
                            className="challenge-checkbox"
                            checked={stepChecked}
                            onChange={() => handleTaskStepToggle(task.id, index)}
                            disabled={isCompleted}
                          />
                          <span style={{ 
                            fontSize: '0.78rem', 
                            color: stepChecked ? '#94a3b8' : '#f1f5f9',
                            textDecoration: stepChecked ? 'line-through' : 'none' 
                          }}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Task completion buttons */}
                  {!isCompleted && (
                    <button 
                      onClick={() => handleCompleteTask(task.id)}
                      className="btn-primary" 
                      style={{ width: '100%', padding: '6px', fontSize: '0.8rem', background: 'var(--accent-fifa)' }}
                    >
                      Mark Assignment Resolved
                    </button>
                  )}
                  {isCompleted && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '4px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-fifa)', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '4px' }}>
                      <CheckCircle2 size={14} /> Duty Resolved & Logged
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem', padding: '24px 0', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '10px' }}>
              📳 Waiting for AI Operations Dispatch. Duty list is currently clear.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: AI Multilingual translation assistant */}
      <div className="flex-column-gap-16">
        {/* Translation hub */}
        <div className="glass-card glow-indigo">
          <div className="card-title-bar">
            <h3><Languages size={18} style={{ color: 'var(--accent-cyber)' }} /> Multilingual Fan Assist</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' }}>
              Gemini Translate
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Select Fan’s Native Language</label>
              <select 
                className="form-input" 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {VOLUNTEER_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            {/* Presets */}
            <div className="form-group">
              <label className="form-label">Common Fan Query Scenarios</label>
              <select 
                className="form-input" 
                value={selectedQueryId}
                onChange={(e) => setSelectedQueryId(e.target.value)}
              >
                {PRESET_QUERIES.map(q => (
                  <option key={q.id} value={q.id}>{q.label}</option>
                ))}
              </select>
            </div>

            {/* Translation Output */}
            {activeQuery && (
              <div style={{ background: 'rgba(2, 6, 23, 0.5)', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', fontWeight: 'bold' }}>FAN SAYS (Translated Native Text):</span>
                  <p style={{ fontSize: '0.85rem', color: '#fff', fontStyle: 'italic' }}>
                    "{activeQuery.translations[selectedLanguage]}"
                  </p>
                </div>

                <div style={{ marginBottom: '8px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyber)', display: 'block', fontWeight: 'bold' }}>AI LOGISTICS GUIDE FOR VOLUNTEER:</span>
                  <p style={{ fontSize: '0.82rem', color: 'var(--accent-cyber)' }}>
                    {activeQuery.englishResponse}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-fifa)', display: 'block', fontWeight: 'bold' }}>AI PHRASE TO SHOW FAN (Pronunciation Assist):</span>
                  <p style={{ fontSize: '0.85rem', color: '#fff', fontStyle: 'italic', fontWeight: 'bold' }}>
                    "{activeQuery.fanResponse[selectedLanguage]}"
                  </p>
                </div>
              </div>
            )}

            {/* Custom text translator */}
            <form onSubmit={handleTranslateCustom} className="form-group" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <label className="form-label">Or Type Custom Phrase to Translate</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ flex: 1, fontSize: '0.8rem' }}
                  placeholder="e.g. Please follow me to the exit ramp..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  disabled={translatingCustom || !customText.trim()}
                >
                  <Globe size={14} /> Translate
                </button>
              </div>
            </form>

            {customTranslationResult && (
              <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: '6px', fontSize: '0.78rem' }}>
                <p style={{ fontStyle: 'italic', color: '#fff', marginBottom: '4px' }}>{customTranslationResult.translated}</p>
                <p style={{ color: '#64748b', fontSize: '0.72rem' }}>💡 {customTranslationResult.englishTip}</p>
              </div>
            )}
          </div>
        </div>

        {/* Field reporter */}
        <div className="glass-card glow-green">
          <div className="card-title-bar">
            <h3><AlertCircle size={18} style={{ color: 'var(--accent-warning)' }} /> Floor Incident Reporter</h3>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.02)', padding: '2px 8px', borderRadius: '10px' }}>
              Dispatches to Ops
            </span>
          </div>

          <form onSubmit={handleFieldReport} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-input"
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                >
                  <option value="Facility">Facility/Janitorial</option>
                  <option value="Medical">Medical Urgent</option>
                  <option value="Security">Security Detail</option>
                  <option value="Crowd">Crowd Spillover</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Floor Sector</label>
                <select 
                  className="form-input"
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                >
                  <option value="Section 101">Section 101</option>
                  <option value="Section 105">Section 105</option>
                  <option value="Section 203">Section 203</option>
                  <option value="VIP-A Suite">VIP Suite A</option>
                  <option value="Gate Plaza B">Gate Plaza B</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Observed Details</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. Liquid spill near handrail, fan lost ticket, escalator running slowly..."
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-danger" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', fontSize: '0.85rem' }}
              disabled={!reportDesc.trim()}
            >
              <AlertTriangle size={14} /> Submit Field Log to HQ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
