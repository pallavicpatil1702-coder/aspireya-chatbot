export const likertScore = (answer, reverse = false) => {
    const scoreMap = {
        "Strongly Agree": 5,
        "Agree": 4,
        "Neutral": 3,
        "Disagree": 2,
        "Strongly Disagree": 1
    };

    let score = scoreMap[answer] || 0;

    if (reverse) {
        score = 6 - score;
    }

    return score;
};

export const aptitudeScore = (selected, correct) => {
    return selected === correct ? 1 : 0;
};

export const calculatePercentage = (score, maxScore) => {
    return Number(((score / maxScore) * 100).toFixed(2));
};