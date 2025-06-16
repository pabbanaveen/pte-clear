

export interface Question {
    id: number;
    image: string;
    title: string;
    description: string;
}

export interface Feedback {
    overallScore: number;
    pronunciation: number;
    fluency: number;
    content: number;
    vocabulary: number;
    feedback: string[];
    improvements: string[];
    contentElements: string[];
}
export const questions: Question[] = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        title: "Bar Chart - Sales Performance",
        description: "A bar chart showing quarterly sales performance across different regions",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        title: "Line Graph - Temperature Trends",
        description: "A line graph displaying temperature trends over the past decade",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&h=400&fit=crop",
        title: "Process Diagram - Manufacturing",
        description: "A flowchart showing the manufacturing process from raw materials to finished products",
    },
];


export const mockFeedback: Feedback = {
    overallScore: 78,
    pronunciation: 80,
    fluency: 75,
    content: 82,
    vocabulary: 76,
    feedback: [
      "Good description of main elements",
      "Clear pronunciation throughout",
      "Appropriate use of data description vocabulary",
      "Well-structured response with logical flow",
    ],
    improvements: [
      "Include more specific numerical data",
      "Use more varied transitional phrases",
      "Practice describing trends more precisely",
      "Work on maintaining consistent pace",
    ],
    contentElements: [
      "Chart type identified ✓",
      "Main trend described ✓",
      "Key data points mentioned ✓",
      "Comparison made ✓",
      "Conclusion provided ✓",
    ],
  };