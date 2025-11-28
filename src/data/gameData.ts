import type { Case, AssessmentItem, CaseSolution } from '../types';

export const CASES: Case[] = [
    {
        id: 'case-1',
        title: '症例A: 70代女性 大腿骨頸部骨折',
        description: '70代女性。転倒により右大腿骨頸部骨折を受傷。人工骨頭置換術後1週経過。既往に高血圧あり。認知機能は保たれている。本日の理学療法評価を実施する。'
    },
    {
        id: 'case-2',
        title: '症例B: 60代男性 脳梗塞左片麻痺',
        description: '60代男性。右中大脳動脈領域の脳梗塞により左片麻痺を呈する。発症後4週経過。回復期リハビリテーション病棟入院中。座位保持は自立しているが、立ち上がり動作に介助を要する。'
    }
];

export const ASSESSMENT_ITEMS: AssessmentItem[] = [
    // 形態測定
    { id: 'eval-1', name: '身長・体重', category: '形態測定' },
    { id: 'eval-2', name: '四肢周径', category: '形態測定' },
    { id: 'eval-3', name: '四肢長', category: '形態測定' },

    // 関節可動域
    { id: 'eval-4', name: 'ROM（股関節）', category: '関節可動域' },
    { id: 'eval-5', name: 'ROM（膝関節）', category: '関節可動域' },
    { id: 'eval-6', name: 'ROM（足関節）', category: '関節可動域' },
    { id: 'eval-7', name: 'ROM（上肢）', category: '関節可動域' },

    // 筋力
    { id: 'eval-8', name: 'MMT（下肢）', category: '筋力' },
    { id: 'eval-9', name: 'MMT（上肢）', category: '筋力' },
    { id: 'eval-10', name: '握力', category: '筋力' },

    // 感覚・疼痛
    { id: 'eval-11', name: '表在感覚', category: '感覚' },
    { id: 'eval-12', name: '深部感覚', category: '感覚' },
    { id: 'eval-13', name: 'NRS/VAS（疼痛）', category: '疼痛' },

    // 循環・呼吸
    { id: 'eval-14', name: '血圧・脈拍', category: '循環・呼吸' },
    { id: 'eval-15', name: 'SpO2', category: '循環・呼吸' },
    { id: 'eval-16', name: '聴診', category: '循環・呼吸' },

    // バランス・歩行
    { id: 'eval-17', name: 'FBS (Berg Balance Scale)', category: 'バランス' },
    { id: 'eval-18', name: 'TUG', category: 'バランス' },
    { id: 'eval-19', name: '10m歩行テスト', category: '歩行' },
    { id: 'eval-20', name: '6分間歩行テスト', category: '歩行' },

    // ADL
    { id: 'eval-21', name: 'FIM', category: 'ADL' },
    { id: 'eval-22', name: 'Barthel Index', category: 'ADL' },

    // 精神・認知
    { id: 'eval-23', name: 'HDS-R', category: '精神・認知' },
    { id: 'eval-24', name: 'MMSE', category: '精神・認知' },
    { id: 'eval-25', name: 'Brunnstrom Recovery Stage', category: '運動麻痺' },
    { id: 'eval-26', name: 'SIAS', category: '運動麻痺' },
];

export const CASE_SOLUTIONS: CaseSolution[] = [
    // Case 1: 大腿骨頸部骨折
    { caseId: 'case-1', assessmentId: 'eval-4', priorityWeight: 5, mustHave: true, rationale: '術後の可動域制限確認のため必須' }, // ROM股
    { caseId: 'case-1', assessmentId: 'eval-5', priorityWeight: 3, mustHave: false, rationale: '隣接関節への影響確認' }, // ROM膝
    { caseId: 'case-1', assessmentId: 'eval-8', priorityWeight: 5, mustHave: true, rationale: '術後の筋力低下確認' }, // MMT下肢
    { caseId: 'case-1', assessmentId: 'eval-13', priorityWeight: 5, mustHave: true, rationale: '術後疼痛の管理' }, // NRS
    { caseId: 'case-1', assessmentId: 'eval-14', priorityWeight: 4, mustHave: true, rationale: 'リスク管理として必須' }, // BP/HR
    { caseId: 'case-1', assessmentId: 'eval-19', priorityWeight: 4, mustHave: false, rationale: '歩行能力の評価' }, // 10m歩行
    { caseId: 'case-1', assessmentId: 'eval-21', priorityWeight: 3, mustHave: false, rationale: 'ADL能力の把握' }, // FIM

    // Case 2: 脳梗塞片麻痺
    { caseId: 'case-2', assessmentId: 'eval-25', priorityWeight: 5, mustHave: true, rationale: '麻痺の回復段階評価に必須' }, // BRS
    { caseId: 'case-2', assessmentId: 'eval-11', priorityWeight: 4, mustHave: true, rationale: '感覚障害の有無確認' }, // 表在感覚
    { caseId: 'case-2', assessmentId: 'eval-12', priorityWeight: 4, mustHave: true, rationale: '運動失調との鑑別' }, // 深部感覚
    { caseId: 'case-2', assessmentId: 'eval-4', priorityWeight: 3, mustHave: false, rationale: '拘縮予防' }, // ROM股
    { caseId: 'case-2', assessmentId: 'eval-6', priorityWeight: 3, mustHave: false, rationale: '尖足予防' }, // ROM足
    { caseId: 'case-2', assessmentId: 'eval-17', priorityWeight: 4, mustHave: false, rationale: 'バランス能力評価' }, // FBS
    { caseId: 'case-2', assessmentId: 'eval-21', priorityWeight: 5, mustHave: true, rationale: '病棟生活の自立度評価' }, // FIM
];
