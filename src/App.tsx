import { useGameLogic } from './hooks/useGameLogic';
import type { AssessmentItem } from './types';
import {
  Activity,
  Brain,
  Heart,
  Ruler,
  Zap,
  Move,
  Smile,
  Thermometer,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw
} from 'lucide-react';

// Category to Icon/Color mapping
const getCategoryStyle = (category: string) => {
  switch (category) {
    case '形態測定': return { icon: Ruler, colorClass: 'cat-morph', color: '#FF6B6B' };
    case '関節可動域': return { icon: Move, colorClass: 'cat-rom', color: '#4ECDC4' };
    case '筋力': return { icon: Zap, colorClass: 'cat-mmt', color: '#45B7D1' };
    case '感覚': return { icon: Activity, colorClass: 'cat-sensory', color: '#96CEB4' };
    case '疼痛': return { icon: Thermometer, colorClass: 'cat-pain', color: '#FFBE0B' };
    case '循環・呼吸': return { icon: Heart, colorClass: 'cat-circ', color: '#FF006E' };
    case 'バランス': return { icon: Activity, colorClass: 'cat-balance', color: '#8338EC' };
    case '歩行': return { icon: Activity, colorClass: 'cat-balance', color: '#8338EC' };
    case 'ADL': return { icon: Smile, colorClass: 'cat-adl', color: '#3A86FF' };
    case '精神・認知': return { icon: Brain, colorClass: 'cat-cog', color: '#FB5607' };
    case '運動麻痺': return { icon: Zap, colorClass: 'cat-mmt', color: '#45B7D1' };
    default: return { icon: Activity, colorClass: 'cat-adl', color: '#3A86FF' };
  }
};

function App() {
  const {
    gameState,
    currentCase,
    allCases,
    allAssessments,
    toggleAssessment,
    selectCase,
    submit,
    reset,
    result
  } = useGameLogic();

  // Group assessments by category for better visualization if needed, 
  // but for masonry/grid look we might keep them flat or grouped.
  // Let's keep them flat for the grid but sorted by category.

  return (
    <div className="container">
      <header>
        <h1>Clinical Reasoning Game</h1>
        <p style={{ color: 'var(--color-text-light)' }}>
          最適な評価項目を選択し、臨床推論スキルを磨こう
        </p>
      </header>

      {/* Case Selection */}
      {!gameState.selectedCaseId && (
        <div className="case-selection">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>症例を選択してください</h2>
          <div className="case-grid">
            {allCases.map(c => (
              <div
                key={c.id}
                className="case-card"
                onClick={() => selectCase(c.id)}
              >
                <div className="case-title">{c.title}</div>
                <div style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                  {c.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Board */}
      {gameState.selectedCaseId && currentCase && (
        <div className="game-board">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{currentCase.title}</h2>
              <p style={{ margin: 0, color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                必要な評価項目を選択してください
              </p>
            </div>
            <button
              onClick={reset}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-text-light)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              症例を選び直す
            </button>
          </div>

          <div className="assessment-grid">
            {allAssessments.map((item: AssessmentItem) => {
              const style = getCategoryStyle(item.category);
              const Icon = style.icon;
              const isSelected = gameState.selectedAssessmentIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`assessment-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleAssessment(item.id)}
                  style={{
                    borderColor: isSelected ? style.color : 'transparent',
                    background: isSelected ? style.color : 'white',
                    color: isSelected ? 'white' : 'var(--color-text)'
                  }}
                >
                  <div
                    className="category-dot"
                    style={{ background: isSelected ? 'white' : style.color }}
                  />
                  <Icon size={20} style={{ opacity: isSelected ? 1 : 0.5 }} />
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                </div>
              );
            })}
          </div>

          {/* Floating Action Button */}
          <div className="fab-container">
            <div style={{
              background: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '50px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 'bold'
            }}>
              <span>選択中:</span>
              <span style={{ fontSize: '1.2rem', color: 'var(--color-cat-adl)' }}>
                {gameState.selectedAssessmentIds.length}
              </span>
            </div>
            <button className="btn-submit" onClick={submit}>
              採点する
            </button>
          </div>
        </div>
      )}

      {/* Result Overlay */}
      {gameState.isSubmitted && result && (
        <div className="result-overlay">
          <div className="result-card">
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={reset}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <RefreshCw size={24} />
              </button>
            </div>

            <div className="score-display">
              <div style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                TOTAL SCORE
              </div>
              <div className="score-number">{result.score}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text-light)' }}>
                / 100
              </div>
            </div>

            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {/* Missing Must Haves */}
              {result.missingMustHaves.length > 0 && (
                <div className="feedback-section">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e53e3e' }}>
                    <AlertTriangle size={20} />
                    見落とした必須項目 (-{result.missingMustHaves.length * 15})
                  </h3>
                  {result.missingMustHaves.map(s => {
                    const item = allAssessments.find(a => a.id === s.assessmentId);
                    return (
                      <div key={s.assessmentId} className="feedback-item missing">
                        <div style={{ fontWeight: 'bold' }}>{item?.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>{s.rationale}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Extra Items */}
              {result.extraItems.length > 0 && (
                <div className="feedback-section">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d69e2e' }}>
                    <XCircle size={20} />
                    不要な項目 (-{result.extraItems.length * 5})
                  </h3>
                  {result.extraItems.map(item => (
                    <div key={item.id} className="feedback-item extra">
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>優先度は低いです</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Correct Items */}
              <div className="feedback-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38a169' }}>
                  <CheckCircle size={20} />
                  正解セット
                </h3>
                {result.correctItems.map(s => {
                  const item = allAssessments.find(a => a.id === s.assessmentId);
                  return (
                    <div key={s.assessmentId} className="feedback-item correct">
                      <div style={{ fontWeight: 'bold' }}>{item?.name}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>{s.rationale}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="btn-submit" onClick={reset}>
                次の症例へ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
