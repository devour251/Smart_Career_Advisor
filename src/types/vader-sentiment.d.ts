declare module 'vader-sentiment' {
  export interface PolarityScores {
    neg: number;
    neu: number;
    pos: number;
    compound: number;
  }

  export const SentimentIntensityAnalyzer: {
    polarity_scores(input: string): PolarityScores;
  };

  const vader: {
    SentimentIntensityAnalyzer: {
      polarity_scores(input: string): PolarityScores;
    };
  };

  export default vader;
}
