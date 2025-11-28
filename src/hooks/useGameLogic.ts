import { useState, useMemo } from 'react';
import { CASES, ASSESSMENT_ITEMS, CASE_SOLUTIONS } from '../data/gameData';
import type { ScoringResult, GameState, CaseSolution } from '../types';

const SCORE_CONFIG = {
    MISS_MUSTHAVE_PENALTY: 15,
    EXTRA_PENALTY: 5,
    ROUND: 1
};

export const useGameLogic = () => {
    const [gameState, setGameState] = useState<GameState>({
        selectedCaseId: null,
        selectedAssessmentIds: [],
        isSubmitted: false
    });

    const currentCase = useMemo(() =>
        CASES.find(c => c.id === gameState.selectedCaseId),
        [gameState.selectedCaseId]
    );

    const toggleAssessment = (id: string) => {
        if (gameState.isSubmitted) return;

        setGameState(prev => {
            const exists = prev.selectedAssessmentIds.includes(id);
            return {
                ...prev,
                selectedAssessmentIds: exists
                    ? prev.selectedAssessmentIds.filter(aid => aid !== id)
                    : [...prev.selectedAssessmentIds, id]
            };
        });
    };

    const selectCase = (caseId: string) => {
        setGameState({
            selectedCaseId: caseId,
            selectedAssessmentIds: [],
            isSubmitted: false
        });
    };

    const calculateScore = (): ScoringResult | null => {
        if (!gameState.selectedCaseId) return null;

        const solutions = CASE_SOLUTIONS.filter(s => s.caseId === gameState.selectedCaseId);
        const solutionIds = new Set(solutions.map(s => s.assessmentId));
        const selectedIds = new Set(gameState.selectedAssessmentIds);

        // Calculate Base Score
        const totalWeight = solutions.reduce((sum, s) => sum + s.priorityWeight, 0);
        let correctWeight = 0;

        const correctItems: CaseSolution[] = [];
        const missingItems: CaseSolution[] = [];
        const missingMustHaves: CaseSolution[] = [];

        solutions.forEach(s => {
            if (selectedIds.has(s.assessmentId)) {
                correctWeight += s.priorityWeight;
                correctItems.push(s);
            } else {
                missingItems.push(s);
                if (s.mustHave) {
                    missingMustHaves.push(s);
                }
            }
        });

        const extraItems = gameState.selectedAssessmentIds
            .filter(id => !solutionIds.has(id))
            .map(id => ASSESSMENT_ITEMS.find(item => item.id === id)!)
            .filter(Boolean);

        let scoreBase = totalWeight > 0 ? (correctWeight / totalWeight) * 100 : 0;

        // Penalties
        const penalty = (missingMustHaves.length * SCORE_CONFIG.MISS_MUSTHAVE_PENALTY) +
            (extraItems.length * SCORE_CONFIG.EXTRA_PENALTY);

        let finalScore = Math.max(0, Math.min(100, scoreBase - penalty));
        finalScore = Number(finalScore.toFixed(SCORE_CONFIG.ROUND));

        return {
            score: finalScore,
            maxScore: 100,
            percentage: finalScore, // Same as score for 0-100 scale
            missingItems,
            missingMustHaves,
            extraItems,
            correctItems
        };
    };

    const submit = () => {
        setGameState(prev => ({ ...prev, isSubmitted: true }));
    };

    const reset = () => {
        setGameState(prev => ({
            ...prev,
            selectedAssessmentIds: [],
            isSubmitted: false
        }));
    };

    return {
        gameState,
        currentCase,
        allCases: CASES,
        allAssessments: ASSESSMENT_ITEMS,
        toggleAssessment,
        selectCase,
        submit,
        reset,
        result: gameState.isSubmitted ? calculateScore() : null
    };
};
