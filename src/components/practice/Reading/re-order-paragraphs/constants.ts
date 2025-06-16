export interface Paragraph {
  id: string;
  text: string;
  originalOrder: number;
}

export interface Question {
  id: number;
  title: string;
  paragraphs: Paragraph[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Climate Change and Its Effects',
    paragraphs: [
      {
        id: 'a',
        text: 'The consequences of climate change are becoming increasingly evident worldwide. Rising sea levels threaten coastal communities, while extreme weather events occur with greater frequency and intensity.',
        originalOrder: 3,
      },
      {
        id: 'b',
        text: 'Climate change refers to long-term shifts in global temperatures and weather patterns. While these shifts can be natural, human activities have been the main driver since the 1800s.',
        originalOrder: 1,
      },
      {
        id: 'c',
        text: 'To address these challenges, governments and organizations worldwide are implementing various strategies. These include transitioning to renewable energy sources, improving energy efficiency, and developing climate adaptation plans.',
        originalOrder: 4,
      },
      {
        id: 'd',
        text: 'The primary cause of recent climate change is the increase in greenhouse gases in the atmosphere. Burning fossil fuels releases carbon dioxide and other gases that trap heat from the sun.',
        originalOrder: 2,
      },
    ],
  },
  {
    id: 2,
    title: 'The Evolution of Artificial Intelligence',
    paragraphs: [
      {
        id: 'a',
        text: 'Today, AI applications are ubiquitous, from smartphone assistants to recommendation systems. Machine learning algorithms can now perform tasks that were once thought to be exclusively human.',
        originalOrder: 4,
      },
      {
        id: 'b',
        text: 'The journey began in the 1950s when scientists first proposed that machines could simulate human intelligence. Early AI programs could solve algebra problems and speak English.',
        originalOrder: 2,
      },
      {
        id: 'c',
        text: 'Artificial Intelligence (AI) has evolved from a science fiction concept to a transformative technology that shapes our daily lives. Its development spans several decades of innovation and research.',
        originalOrder: 1,
      },
      {
        id: 'd',
        text: 'The 1980s and 1990s saw significant advances with the development of expert systems and neural networks. These technologies laid the foundation for modern AI capabilities.',
        originalOrder: 3,
      },
    ],
  },
];