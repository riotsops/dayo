const messages = {
  peaceful: [
    "You don't have to fix everything today. Just breathe and let today be enough.",
    "There is nothing to rush toward. You are already where you need to be.",
    "Let the morning be slow. The world can wait a few more minutes.",
    "Peace isn't something you find. It's something you return to.",
    "Not every day needs a plan. Some days just need presence.",
    "You are allowed to move gently through this day.",
    "The quieter you become, the more you can hear what actually matters.",
    "Today doesn't need to be big. Small and calm is enough.",
    "Stillness is not emptiness. It is where clarity lives.",
    "You are not falling behind. You are moving at the pace of your own life.",
    "Some mornings the only goal is to feel okay. That is enough.",
    "Let today unfold. You don't have to force it into shape.",
    "Breathe before you check your phone. The world can wait one more minute.",
    "Not every thought needs your attention today.",
    "You are allowed to have a quiet day in a loud world."
  ],
  ambitious: [
    "You have something most people don't — you actually care. Use that today.",
    "Nobody is coming to build your life for you. That's not sad. That's power.",
    "One focused hour today is worth more than ten distracted ones.",
    "The gap between who you are and who you want to be closes one day at a time.",
    "Do the thing you keep putting off. Just the first step. Right now.",
    "Your future self is watching how you spend today.",
    "Comfort is expensive. It costs you the life you could have had.",
    "Start before you're ready. You'll never be fully ready.",
    "The people who change their lives don't wait for the right moment. They create it.",
    "Every expert was once a beginner who refused to quit.",
    "You don't rise to the level of your dreams. You fall to the level of your habits.",
    "Do something today that makes tomorrow easier.",
    "The version of you that succeeds is already inside you. Let them out.",
    "Stop waiting for permission. Nobody is going to give it to you.",
    "Progress is quiet. Keep going even when nobody is watching."
    "I think you should chase your goal so hard other people think you're crazy, and then when you succeed, they'll ask you how you did it",
  ],
  disciplined: [
    "Discipline is just doing what matters when you don't feel like it.",
    "You don't need motivation. You need a decision.",
    "Show up today like the person you're becoming, not the person you've been.",
    "Every time you do hard things, you become someone who can do hard things.",
    "The feeling will follow the action. Start first.",
    "Small consistent steps beat occasional giant leaps every time.",
    "Your habits are quietly building someone. Make sure it's who you want.",
    "Don't negotiate with laziness. Just begin.",
    "The hard part is starting. After that, momentum takes over.",
    "You have done hard things before. Today is no different.",
    "Discipline is a form of self-respect. You are worth showing up for.",
    "One percent better every day. That's all it takes.",
    "Your future self will thank you for what you do today.",
    "The discomfort of discipline is temporary. The regret of not trying is not.",
    "Build the habit first. The results come after."
  ],
  comforting: [
    "You're doing better than you think. That's not just something people say.",
    "It's okay if today is hard. Hard days happen to good people too.",
    "You don't have to be okay all the time. That's what makes you human.",
    "Rest is not giving up. Rest is how you keep going.",
    "You've survived every hard day so far. Your record is still perfect.",
    "Be a little gentler with yourself today. You deserve that.",
    "Not every problem needs solving today. Some just need time.",
    "You are enough, exactly as you are right now.",
    "It's okay to not have it all figured out. Nobody does.",
    "Some days just need to be survived. And that's okay.",
    "You are not a burden. You are a person having a hard time.",
    "The fact that you care so much shows how good your heart is.",
    "Give yourself the grace you would give a friend.",
    "You don't have to earn rest. You are allowed to just be.",
    "Whatever you are feeling right now is valid. You don't have to explain it."
  ],
  reflective: [
    "What are you carrying that you don't actually need anymore?",
    "The version of you from a year ago would be proud of how far you've come.",
    "What would today look like if you approached it with curiosity instead of pressure?",
    "You teach people how to treat you by how you treat yourself.",
    "What's one thing you keep telling yourself that might not be true?",
    "Growth doesn't always feel like growth while it's happening.",
    "What do you actually want? Not what you think you should want.",
    "The life you want is built in the ordinary moments, not the big ones.",
    "Who were you before the world told you who to be?",
    "What would you do today if you weren't afraid of what people thought?",
    "You are constantly becoming. The question is becoming what.",
    "What does a good day actually look like for you? Not for anyone else.",
    "The things that bother you most reveal what you value most.",
    "What are you avoiding that you already know the answer to?",
    "Someday you will look back at this exact moment and understand it better."
  ],
  healing: [
    "Healing isn't linear. A hard day doesn't undo all your progress.",
    "You are not behind. You are on your own timeline.",
    "It's okay to still be healing from things you don't talk about.",
    "Some days surviving is the whole achievement. That counts.",
    "You don't have to explain your healing to anyone.",
    "Give yourself the same patience you'd give someone you love.",
    "The fact that you're still trying says everything about who you are.",
    "You are not what happened to you. You are what you choose to do next.",
    "Rest is part of healing. You don't have to earn it.",
    "You are allowed to outgrow people, places, and old versions of yourself.",
    "The wounds you carry don't make you weak. They make you deep.",
    "You have been through hard things before and found your way through.",
    "Healing happens in the quiet moments you don't notice.",
    "Be patient with yourself. You are working through things that take time.",
    "You are not broken. You are in the middle of the story."
  ]
};

// Daily message rotation — cycles through all messages across 365 days
function getDailyMessage(mood) {
  const list = messages[mood] || messages['peaceful'];
  const start = new Date('2024-01-01');
  const today = new Date();
  const dayNumber = Math.floor((today - start) / 86400000);
  const index = dayNumber % list.length;
  return list[index];
}
