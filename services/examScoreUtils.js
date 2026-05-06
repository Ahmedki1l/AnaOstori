const sectionDenominator = (exam, sectionIdx) =>
    exam?.sections?.[sectionIdx]?.questions?.length || 0;

const overallDenominator = (exam) =>
    (exam?.sections || []).reduce((s, sec) => s + (sec?.questions?.length || 0), 0);

const countCorrectInSection = (reviewArr, examArr) => {
    if (!reviewArr || !examArr) return 0;
    let correct = 0;
    for (let i = 0; i < reviewArr.length; i++) {
        const r = reviewArr[i];
        const byIndex = examArr[i];
        const e = byIndex || examArr.find(q => String(q?._id) === String(r?.id));
        if (e && r?.selectedAnswer != null && String(r.selectedAnswer) === String(e.correctAnswer)) {
            correct++;
        }
    }
    return correct;
};

const pct = (correct, total) => (total > 0 ? Math.round((correct / total) * 100) : 0);

const sectionScore = (exam, examArr, reviewArr, sectionIdx) => {
    const total = sectionDenominator(exam, sectionIdx);
    const correct = countCorrectInSection(reviewArr, examArr);
    return { correct, total, percentage: pct(correct, total) };
};

const overallScore = (exam, allExamQuestions, allReviewQuestions) => {
    const total = overallDenominator(exam);
    const correct = (allExamQuestions || []).reduce(
        (s, secEx, i) => s + countCorrectInSection(allReviewQuestions?.[i], secEx),
        0,
    );
    return { correct, total, percentage: pct(correct, total) };
};

export const examScoreUtils = {
    sectionDenominator,
    overallDenominator,
    countCorrectInSection,
    pct,
    sectionScore,
    overallScore,
};
