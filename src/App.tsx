import { useGameLogic } from './hooks/useGameLogic';
import type { AssessmentItem } from './types';

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

  // Group assessments by category
  const assessmentsByCategory = allAssessments.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, AssessmentItem[]>);

  return (
    <div className="app">
      <header>
        <div className="container">
          <h1>理学療法推論：評価項目ゲーム</h1>
          {gameState.selectedCaseId && (
            <button className="btn btn-secondary" onClick={reset}>
              症例選択に戻る
            </button>
          )}
        </div>
      </header>

      <main className="container">
        {!gameState.selectedCaseId ? (
          // Case Selection View
          <div className="grid grid-2">
            {allCases.map(c => (
              <div key={c.id} className="card" onClick={() => selectCase(c.id)} style={{ cursor: 'pointer' }}>
                <h2>{c.title}</h2>
                <p>{c.description}</p>
                <button className="btn btn-primary">この症例を選択</button>
              </div>
            ))}
          </div>
        ) : !gameState.isSubmitted ? (
          // Assessment Selection View
          <>
            <div className="card">
              <h2>{currentCase?.title}</h2>
              <p>{currentCase?.description}</p>
            </div>

            <div className="grid">
              {Object.entries(assessmentsByCategory).map(([category, items]) => (
                <div key={category} className="category-section">
                  <h3>{category}</h3>
                  <div className="assessment-list">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className={`assessment-item ${gameState.selectedAssessmentIds.includes(item.id) ? 'selected' : ''}`}
                        onClick={() => toggleAssessment(item.id)}
                      >
                        <span className="name">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="floating-status">
              <span>選択数: <strong>{gameState.selectedAssessmentIds.length}</strong></span>
              <button
                className="btn btn-primary"
                onClick={submit}
                disabled={gameState.selectedAssessmentIds.length === 0}
              >
                採点する
              </button>
            </div>
          </>
        ) : (
          // Result View
          <div className="result-view">
            <div className="result-summary">
              <h2>スコア</h2>
              <div className="score-large">{result?.score}</div>
              <p>点</p>
            </div>

            <div className="grid grid-2">
              <div className="card">
                <h3>⚠️ 選択漏れ (Must Have)</h3>
                {result?.missingMustHaves.length === 0 ? (
                  <p className="text-success">なし（素晴らしい！）</p>
                ) : (
                  <ul>
                    {result?.missingMustHaves.map(m => {
                      const item = allAssessments.find(a => a.id === m.assessmentId);
                      return (
                        <li key={m.assessmentId}>
                          <strong>{item?.name}</strong>
                          <br /><small>{m.rationale}</small>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="card">
                <h3>🚫 不要な選択 (Penalty)</h3>
                {result?.extraItems.length === 0 ? (
                  <p className="text-success">なし（的確です！）</p>
                ) : (
                  <ul>
                    {result?.extraItems.map(item => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="card">
              <h3>正解セットと解説</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '8px' }}>評価項目</th>
                    <th style={{ padding: '8px' }}>重要度</th>
                    <th style={{ padding: '8px' }}>解説</th>
                  </tr>
                </thead>
                <tbody>
                  {result?.correctItems.concat(result.missingItems).sort((a, b) => b.priorityWeight - a.priorityWeight).map(s => {
                    const item = allAssessments.find(a => a.id === s.assessmentId);
                    const isSelected = gameState.selectedAssessmentIds.includes(s.assessmentId);
                    return (
                      <tr key={s.assessmentId} style={{ background: isSelected ? '#e8f5e9' : 'transparent', borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px' }}>
                          {item?.name}
                          {s.mustHave && <span className="badge badge-must" style={{ marginLeft: '4px' }}>必須</span>}
                        </td>
                        <td style={{ padding: '8px' }}>{s.priorityWeight}</td>
                        <td style={{ padding: '8px' }}>{s.rationale}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
