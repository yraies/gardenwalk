import { type AnswerOption, Category, Form, Question } from "../types/Form";

/**
 * Creates a deterministic TypeID suffix from a template index and item index.
 * Suffixes are 26-char Crockford base32 strings with first char in [0-7].
 * This ensures forms created from the same starter template across different
 * page loads share identical category/question IDs, enabling comparison.
 */
function makeSuffix(templateIdx: number, itemIdx: number): string {
  const b32 = "0123456789abcdefghjkmnpqrstvwxyz";
  // First char identifies template (0-7)
  let suffix = b32[templateIdx % 8];
  // Encode item index in last 6 chars (base32), pad middle with zeros
  let idx = itemIdx;
  const indexChars: string[] = [];
  for (let i = 0; i < 6; i++) {
    indexChars.unshift(b32[idx % 32]);
    idx = Math.floor(idx / 32);
  }
  suffix += "0".repeat(19) + indexChars.join(""); // 1 + 19 + 6 = 26
  return suffix;
}

/**
 * Factory that produces Question and Category builders with stable,
 * deterministic IDs tied to a template index.
 */
function stableIds(templateIdx: number) {
  let counter = 0;
  return {
    q(value: string): Question {
      return Question.withStableId(makeSuffix(templateIdx, counter++), value);
    },
    c(name: string, questions: Question[]): Category {
      return Category.withStableId(
        makeSuffix(templateIdx, counter++),
        name,
        questions,
      );
    },
  };
}

// Template 0: Relationship Menu (Light)
const ids0 = stableIds(0);
const RelationshipMenuLight = Form.new("Relationship Menu", [
  ids0.c("Commitment", [
    ids0.q("Relationship labels"),
    ids0.q("Commitment to working through challenges"),
    ids0.q("Commitment to relationship maintenance"),
    ids0.q("Prioritization over other partners"),
    ids0.q("Sharing pet(s)"),
    ids0.q("Cohabitation"),
    ids0.q("Home ownership"),
    ids0.q("Pregnancy/children together"),
    ids0.q("Marriage"),
  ]),
  ids0.c("Emotional Intimacy", [
    ids0.q("Expressing happiness and joy"),
    ids0.q("Sharing stories about past"),
    ids0.q("Sharing hopes for future"),
    ids0.q("Offering support in hard times"),
    ids0.q("Venting/Ranting"),
    ids0.q('Saying "I love you"'),
  ]),
  ids0.c("Social Integration", [
    ids0.q("Meeting friends"),
    ids0.q("Meeting parents/siblings/extended/found family"),
    ids0.q("Meeting children"),
    ids0.q("Presenting as a couple in public settings"),
    ids0.q("Presenting as a couple on social media"),
  ]),
  ids0.c("Communication", [
    ids0.q("Texting"),
    ids0.q("Phone/video calls"),
    ids0.q("Daily or frequent check-ins"),
    ids0.q("Discussing work and hobbies"),
    ids0.q("Discussing partners/relationships"),
    ids0.q("Ability to express disagreements or hurt feelings"),
  ]),
  ids0.c("Physical Intimacy", [
    ids0.q("Physical affection (e.g. touch, hugs, cuddles)"),
    ids0.q("Kissing"),
    ids0.q("Public display of affection"),
    ids0.q("Sexual intimacy"),
    ids0.q("Orgasms"),
    ids0.q("Condom/Barrier use"),
    ids0.q("Regular STI testing"),
  ]),
  ids0.c("Caregiving", [
    ids0.q("General needs/favours"),
    ids0.q("Health/Illness"),
    ids0.q("Emergencies"),
    ids0.q("Disability"),
  ]),
  ids0.c("Quality Time", [
    ids0.q("Shared hobbies or activities"),
    ids0.q("Date nights"),
    ids0.q("Spending the night"),
    ids0.q("Regularly scheduled time together"),
    ids0.q("Shared vacations"),
  ]),
  ids0.c("Autonomy", [
    ids0.q("Alone time"),
    ids0.q("Balance time together and apart"),
    ids0.q("Support to pursue independent interests"),
    ids0.q("Maintaining independent friendships"),
    ids0.q("Maintaining independent romantic relationships"),
    ids0.q("Sexual exclusivity"),
    ids0.q("Romantic/Emotional exclusivity"),
  ]),
]);

// Template 1: Relationship Menu (Advanced)
const ids1 = stableIds(1);
const RelationshipMenuAdvanced = Form.new("Relationship Menu (Advanced)", [
  ids1.c("Commitment", [
    ids1.q("Relationship labels"),
    ids1.q("Commitment to working through challenges"),
    ids1.q("Commitment to relationship maintenance"),
    ids1.q("Prioritization over other partners"),
    ids1.q("Sharing pet(s)"),
    ids1.q("Having a key"),
    ids1.q("Cohabitation"),
    ids1.q("Home ownership"),
    ids1.q("Planning for future"),
    ids1.q("Expectation of long term involvement"),
    ids1.q("Support through health challenges"),
    ids1.q("Restrictions due to other relationships"),
    ids1.q("Restrictions for other relationships"),
    ids1.q("Coparenting children from other partnerships"),
    ids1.q("Pregnancy/Having children together"),
    ids1.q("Power of attorney/wills"),
    ids1.q("Marriage"),
  ]),
  ids1.c("Emotional Intimacy", [
    ids1.q("Expressing happiness and joy"),
    ids1.q("Sharing stories about past"),
    ids1.q("Sharing hopes for future"),
    ids1.q("Knowing personal likes/dislikes (e.g. fav foods)"),
    ids1.q("Using pet names"),
    ids1.q("Active listening"),
    ids1.q("Being asked for advice"),
    ids1.q("Offering support in hard times"),
    ids1.q("Venting/Ranting"),
    ids1.q("Sharing vulnerable feelings"),
    ids1.q('Saying "I love you"'),
    ids1.q("Sharing about mental health challenges"),
    ids1.q("Supporting mental health work"),
  ]),
  ids1.c("Social Integration", [
    ids1.q("Following on social media"),
    ids1.q("Meeting friends"),
    ids1.q("Meeting parents/siblings/extended/found family"),
    ids1.q("Meeting children"),
    ids1.q("Meeting metamours (partners' other partners)"),
    ids1.q("Positive relationships with metamours"),
    ids1.q("Spending time as a couple with friends/family"),
    ids1.q("Serving as +1 for social events"),
    ids1.q("Presenting as a couple in public settings"),
    ids1.q("Presenting as a couple on social media"),
    ids1.q("Presenting as a couple in professional settings"),
    ids1.q("Joint vacations with (found-)family/metamours"),
  ]),
  ids1.c("Communication", [
    ids1.q("Texting"),
    ids1.q("Phone/video calls"),
    ids1.q("Daily or frequent check-ins"),
    ids1.q("Discussing work and hobbies"),
    ids1.q("Discussing family"),
    ids1.q("Discussing partners/relationships"),
    ids1.q("Discussing politics and current events"),
    ids1.q("Ability to express disagreements or hurt feelings"),
    ids1.q("Ability to address and resolve conflict"),
    ids1.q("Radical honesty"),
  ]),
  ids1.c("Physical Intimacy", [
    ids1.q("Physical affection (e.g. touch, hugs, cuddles)"),
    ids1.q("Kissing"),
    ids1.q("Public display of affection"),
    ids1.q("Co-Sleeping"),
    ids1.q("Nudity"),
    ids1.q("Sexual chemistry"),
    ids1.q("Compatible sex drives"),
    ids1.q("Orgasms"),
    ids1.q("Oral sex"),
    ids1.q("Manual sex (e.g. fingering)"),
    ids1.q("Mutual masturbation"),
    ids1.q("Penetration/PIV"),
    ids1.q("Sex toys"),
    ids1.q("Condom/Barrier use"),
    ids1.q("Regular STI testing"),
    ids1.q("Kinky stuff (e.g. BDSM)"),
    ids1.q("Threesomes or group sex"),
    ids1.q("Attending events (e.g. Private play parties)"),
  ]),
  ids1.c("Bathroom Intimacy", [
    ids1.q("Unlocked door"),
    ids1.q("Showering together"),
    ids1.q("Be present when urinating"),
    ids1.q("Be present when pooping"),
  ]),
  ids1.c("Financial Management", [
    ids1.q("Mutual contributions to activities"),
    ids1.q("Large gifts"),
    ids1.q("Financial support"),
    ids1.q("Shared bank account(s)"),
    ids1.q("Co-ownership of property"),
    ids1.q("Complete financial integration"),
  ]),
  ids1.c("Technology", [
    ids1.q("Shared passwords"),
    ids1.q("Shared accounts"),
    ids1.q("Shared devices (e.g. computers, phones)"),
  ]),
  ids1.c("Domestic", [
    ids1.q("Sharing meals"),
    ids1.q("Cooking together"),
    ids1.q("Sharing chores and routines"),
    ids1.q("Shared bed/sleeping space"),
  ]),
  ids1.c("Caregiving", [
    ids1.q("General needs/favours"),
    ids1.q("Health/Illness"),
    ids1.q("Emergencies"),
    ids1.q("Disability"),
    ids1.q("End of life"),
  ]),
  ids1.c("Co-Caregiving", [
    ids1.q("Animals/Pet(s)"),
    ids1.q("Plants"),
    ids1.q("(Found-)Family Members"),
    ids1.q("Partners/Metamours"),
    ids1.q("Children"),
  ]),
  ids1.c("Quality Time", [
    ids1.q("Shared hobbies or activities"),
    ids1.q("Date nights"),
    ids1.q("Spending the night"),
    ids1.q("Regularly scheduled time together"),
    ids1.q("Calendar management/integration"),
    ids1.q("Shared vacations"),
  ]),
  ids1.c("Autonomy", [
    ids1.q("Alone time"),
    ids1.q("Balance time together and apart"),
    ids1.q("Support to pursue independent interests"),
    ids1.q("Maintaining independent friendships"),
    ids1.q("Maintaining independent romantic relationships"),
    ids1.q("Equal distribution of relationship power"),
    ids1.q("Sexual exclusivity"),
    ids1.q("Romantic/Emotional exclusivity"),
  ]),
]);

// Template 4: Pen and Paper Preferences
const ids4 = stableIds(4);
const PenAndPaperTemplate = Form.new("Pen and Paper Preferences", [
  ids4.c("Frequency", [
    ids4.q("Dayily Games"),
    ids4.q("Weekly Games"),
    ids4.q("Bi-weekly Games"),
    ids4.q("Monthly Games"),
    ids4.q("Regular Sessions"),
    ids4.q("Irregular Sessions"),
  ]),
  ids4.c("Session Length", [
    ids4.q("Short (1-2 hours)"),
    ids4.q("Medium (3-4 hours)"),
    ids4.q("Long (5+ hours)"),
  ]),
  ids4.c("Play Style", [
    ids4.q("Theater of the Mind"),
    ids4.q("Haptic/Physical Props"),
    ids4.q("Narrative"),
    ids4.q("Performative"),
    ids4.q("Simulationist"),
    ids4.q("Competitive / Min-Maxing"),
    ids4.q("Cooperative / Group Storytelling"),
  ]),
  ids4.c("Game Type", [
    ids4.q("Combat"),
    ids4.q("Roleplay"),
    ids4.q("Exploration"),
    ids4.q("Social"),
    ids4.q("Puzzle"),
    ids4.q("Mystery"),
    ids4.q("Horror"),
    ids4.q("Sandbox"),
    ids4.q("Linear"),
    ids4.q("Open World"),
  ]),
  ids4.c("Game Tone", [
    ids4.q("Serious"),
    ids4.q("Silly"),
    ids4.q("Dark"),
    ids4.q("Light"),
    ids4.q("Mature"),
    ids4.q("Family Friendly"),
    ids4.q("Adults Only"),
  ]),
  ids4.c("Game Setting", [
    ids4.q("High Fantasy"),
    ids4.q("Low Fantasy"),
    ids4.q("Modern"),
    ids4.q("Historical"),
    ids4.q("Sci-Fi"),
    ids4.q("Post-Apocalyptic"),
    ids4.q("Other"),
  ]),
]);

// Template 5: Attraction Map — untangling what draws you to someone
const ids5 = stableIds(5);
const AttractionMapAnswerOptions: AnswerOption[] = [
  {
    key: "strongly",
    label: "Strongly",
    shortLabel: "Strong",
    color: "#9C7DB5",
    icon: "heart",
    semantic: "must",
  },
  {
    key: "a_little",
    label: "A Little",
    shortLabel: "Little",
    color: "#7094B0",
    icon: "check",
    semantic: "like",
  },
  {
    key: "could_grow",
    label: "Could Grow",
    shortLabel: "Could",
    color: "#C5A958",
    icon: "question",
    semantic: "maybe",
  },
  {
    key: "no",
    label: "No",
    shortLabel: "No",
    color: "#908A82",
    icon: "x",
    semantic: "dislike",
  },
  {
    key: "unset",
    label: "Unset",
    shortLabel: "Unset",
    color: "#b39a84",
    icon: "empty",
  },
];
const AttractionMapTemplate = Form.new(
  "Attraction Map",
  [
    ids5.c("Aesthetic Attraction", [
      ids5.q(
        "I notice their appearance, style, movements, or expressions more than I usually notice other people's.",
      ),
      ids5.q(
        "I enjoy looking at them or being visually aware of them, even when I do not want anything else to happen.",
      ),
      ids5.q(
        "I find ordinary moments with them visually striking, graceful, charming, or beautiful.",
      ),
      ids5.q(
        "Something about their presence catches my attention repeatedly, even when we are not interacting much.",
      ),
    ]),

    ids5.c("Sensual Attraction", [
      ids5.q(
        "I enjoy being physically near them, such as sitting close, walking side by side, or sharing quiet space.",
      ),
      ids5.q(
        "I feel drawn to ordinary affectionate touch with them, such as hugs, leaning, holding hands, or casual contact.",
      ),
      ids5.q(
        "I imagine gentle or comforting physical closeness with them, without that necessarily becoming sexual.",
      ),
      ids5.q(
        "Their physical presence feels calming, grounding, pleasant, or reassuring to be around.",
      ),
    ]),

    ids5.c("Sexual Attraction", [
      ids5.q(
        "I notice a sexual charge, tension, or bodily response around them that feels different from ordinary closeness.",
      ),
      ids5.q(
        "I find myself imagining sexual situations with them, even if I am not sure I would want to act on them.",
      ),
      ids5.q(
        "I feel curious about what sexual chemistry with them would be like in practice.",
      ),
      ids5.q(
        "If they expressed sexual interest in me, I would want to seriously consider whether I shared that interest.",
      ),
    ]),

    ids5.c("Romantic Attraction", [
      ids5.q(
        "I imagine having a distinct 'us' with them that feels different from ordinary friendship or companionship.",
      ),
      ids5.q(
        "I want to be special to them in a way that would matter even if nothing sexual happened.",
      ),
      ids5.q(
        "I find myself imagining future scenarios where we are meaningfully present in each other's lives.",
      ),
      ids5.q(
        "I feel drawn to gestures of chosen closeness with them, such as dates, anniversaries, shared rituals, or being recognized as important to each other.",
      ),
    ]),

    ids5.c("Emotional Attraction", [
      ids5.q(
        "I want to tell them things that feel personal, vulnerable, or emotionally important.",
      ),
      ids5.q(
        "When something meaningful happens, I notice an impulse to share it with them.",
      ),
      ids5.q(
        "I feel interested in their inner world: how they feel, what shaped them, and what matters to them.",
      ),
      ids5.q(
        "Being emotionally understood by them, or understanding them in return, feels especially meaningful.",
      ),
    ]),

    ids5.c("Intellectual Attraction", [
      ids5.q(
        "I want to hear how they think through complicated, strange, or important questions.",
      ),
      ids5.q(
        "Conversations with them make me notice new angles, ideas, or possibilities.",
      ),
      ids5.q(
        "I feel drawn to debate, explore, learn, or build understanding together with them.",
      ),
      ids5.q(
        "Their mind, perspective, humor, or way of making connections keeps my attention.",
      ),
    ]),

    ids5.c("Spiritual / Existential Attraction", [
      ids5.q(
        "I feel drawn to the way they relate to meaning, purpose, values, or the bigger picture of life.",
      ),
      ids5.q(
        "Being around them makes me reflect on who I am, what matters to me, or how I want to live.",
      ),
      ids5.q(
        "I sense that we might share, challenge, or deepen each other's worldview in an important way.",
      ),
      ids5.q(
        "Moments with them can feel unusually significant, symbolic, grounding, or expansive.",
      ),
    ]),

    ids5.c("Platonic Attraction", [
      ids5.q(
        "I want them in my life as someone close, trusted, and personally important.",
      ),
      ids5.q(
        "I imagine spending meaningful time with them without needing it to become romantic or sexual.",
      ),
      ids5.q(
        "I feel drawn to care about their life, support them, and be supported by them.",
      ),
      ids5.q(
        "I would value a committed or lasting bond with them even if it were clearly non-romantic.",
      ),
    ]),

    ids5.c("Alterous / Queerplatonic Attraction", [
      ids5.q(
        "I feel drawn to a kind of closeness with them that does not fit neatly into friendship, romance, or sexual attraction.",
      ),
      ids5.q(
        "I want a bond with them that feels personally significant, even if I do not know what category it belongs in.",
      ),
      ids5.q(
        "I imagine forms of commitment, care, priority, or intimacy with them that would need their own definition.",
      ),
      ids5.q(
        "Standard labels like 'friend,' 'crush,' 'partner,' or 'date' feel too narrow, too loaded, or not quite right for what I notice.",
      ),
    ]),
  ],
  AttractionMapAnswerOptions,
);

// Template 6: What's Between Us — observational exploration of shared connection
const ids6 = stableIds(6);
const SharedConnectionAnswerOptions: AnswerOption[] = [
  {
    key: "absolutely",
    label: "Absolutely!",
    shortLabel: "Yes!",
    color: "#9C7DB5",
    icon: "heart",
    semantic: "must",
  },
  {
    key: "some_good",
    label: "Some, and I Like It",
    shortLabel: "Good",
    color: "#7094B0",
    icon: "check",
    semantic: "like",
  },
  {
    key: "no_fine",
    label: "No, and That's Fine",
    shortLabel: "Fine",
    color: "#68A58A",
    icon: "thumbsup",
    semantic: "neutral",
  },
  {
    key: "want_more",
    label: "I Want More",
    shortLabel: "More",
    color: "#C5A958",
    icon: "exclamation",
    semantic: "maybe",
  },
  {
    key: "want_less",
    label: "I Want Less",
    shortLabel: "Less",
    color: "#908A82",
    icon: "minus",
    semantic: "dislike",
  },
  {
    key: "unset",
    label: "Unset",
    shortLabel: "Unset",
    color: "#b39a84",
    icon: "empty",
  },
];
const SharedConnectionTemplate = Form.new(
  "What's Between Us",
  [
    ids6.c("Shared Attention", [
      ids6.q(
        "We tend to notice the same things \u2014 a detail, a moment, something worth pausing for.",
      ),
      ids6.q(
        "When I show them something I find interesting, they actually engage with it.",
      ),
      ids6.q(
        "We get absorbed in the same thing at the same time, without needing to explain why it matters.",
      ),
      ids6.q(
        "We discover things together that neither of us would have noticed alone.",
      ),
    ]),

    ids6.c("Shared Comfort", [
      ids6.q(
        "Being around them without filling the silence feels natural and comfortable.",
      ),
      ids6.q("I feel at ease in their presence, even on a bad day."),
      ids6.q(
        "They seem to know my rhythms \u2014 when I need space, when I need company \u2014 without me having to explain.",
      ),
      ids6.q("Being together feels like resting, not like effort."),
    ]),

    ids6.c("Shared Growth", [
      ids6.q(
        "I learn things from them that I would not easily learn on my own.",
      ),
      ids6.q(
        "We challenge each other's assumptions without it feeling like a threat.",
      ),
      ids6.q("Knowing them is making me a better version of myself."),
      ids6.q("We are both changing because of this connection."),
    ]),

    ids6.c("Shared Play", [
      ids6.q(
        "I can be silly or spontaneous with them without worrying about how I come across.",
      ),
      ids6.q(
        "We try new things together \u2014 places, activities, experiences \u2014 just to see what happens.",
      ),
      ids6.q(
        "We have inside jokes, shared references, or ways of being together that feel uniquely ours.",
      ),
      ids6.q("The kind of fun we have together makes time disappear."),
    ]),

    ids6.c("Shared Meaning", [
      ids6.q(
        "We talk about things that actually matter \u2014 values, purpose, direction.",
      ),
      ids6.q(
        "We are building something together that reflects what we both care about.",
      ),
      ids6.q(
        "We have shared rituals, traditions, or practices that carry meaning for both of us.",
      ),
      ids6.q(
        "Our connection feels like it is about something larger than just enjoying each other's company.",
      ),
    ]),

    ids6.c("Shared Care", [
      ids6.q(
        "I look out for them in practical ways \u2014 checking in, helping out, being reliable.",
      ),
      ids6.q("They look out for me in the same way."),
      ids6.q(
        "I feel genuinely responsible for their wellbeing, without it being an obligation.",
      ),
      ids6.q("When something goes wrong, I am someone they turn to."),
    ]),

    ids6.c("Shared Identity", [
      ids6.q(
        '"We" feels like a thing \u2014 not just two individuals who happen to spend time together.',
      ),
      ids6.q("Others associate us with each other in some way."),
      ids6.q("What we have feels distinct from my other relationships."),
      ids6.q(
        "We represent each other in some way \u2014 speak for, advocate for, or stand with each other.",
      ),
    ]),

    ids6.c("Shared Commitment", [
      ids6.q("We make time, energy, and space for each other as a priority."),
      ids6.q(
        "There is a mutual trust that this connection will still be here after difficulty or distance.",
      ),
      ids6.q(
        "We invest effort into maintaining or deepening this connection, even when it is not easy.",
      ),
      ids6.q(
        "What we have is important enough that losing it would genuinely affect both of our lives.",
      ),
    ]),

    ids6.c("Shared Boundaries", [
      ids6.q(
        "We have an understanding \u2014 spoken or unspoken \u2014 about what we can count on from each other.",
      ),
      ids6.q(
        "There are things that feel exclusive or protected about this connection, even if we have never named them.",
      ),
      ids6.q(
        "We have discussed, or would be willing to discuss, what this relationship is and is not.",
      ),
      ids6.q(
        "The way we label or do not label this connection feels right for what it actually is.",
      ),
    ]),
  ],
  SharedConnectionAnswerOptions,
);

// Template 7: How Do I See Us — relational role/dynamic exploration
const ids7 = stableIds(7);
const RelationalDynamicsTemplate = Form.new(
  "How Do I See Us?",
  [
    // Equals
    ids7.c("Peer / Companion", [
      ids7.q(
        "We relate to each other as equals \u2014 neither of us holds more power or authority in the dynamic.",
      ),
      ids7.q(
        "We share the weight of decisions, problems, or planning without one of us defaulting to leading.",
      ),
      ids7.q(
        "We contribute to the connection in different but roughly balanced ways.",
      ),
      ids7.q(
        "Walking alongside each other feels more natural than leading or following.",
      ),
    ]),

    ids7.c("Playmate", [
      ids7.q("We bring out each other's playful, silly, or spontaneous side."),
      ids7.q(
        "Together we gravitate toward fun, adventure, or lighthearted experiences.",
      ),
      ids7.q("We make each other laugh in ways that feel easy and unforced."),
      ids7.q(
        "Time with them often feels more like play than like anything else.",
      ),
    ]),

    // Growth
    ids7.c("Mentor / Student", [
      ids7.q(
        "One of us naturally teaches, guides, or shares experience, and the other learns from it.",
      ),
      ids7.q(
        "I look up to them in some area, or they look up to me, and that feels comfortable.",
      ),
      ids7.q(
        "There is a dynamic where one of us opens doors for the other that they could not open alone.",
      ),
      ids7.q(
        "The learning between us feels intentional \u2014 not just incidental.",
      ),
    ]),

    ids7.c("Catalyst / Spark", [
      ids7.q(
        "Being around them makes me want to act, change, or try something I have been putting off.",
      ),
      ids7.q(
        "They challenge me in ways that feel exciting rather than threatening.",
      ),
      ids7.q(
        "Our connection has momentum \u2014 it moves things forward rather than keeping things static.",
      ),
      ids7.q(
        "I am not the same person I was before this connection, and that feels like a good thing.",
      ),
    ]),

    // Building
    ids7.c("Creative Partner", [
      ids7.q(
        "We make things together \u2014 ideas, projects, art, plans \u2014 and the process feels collaborative.",
      ),
      ids7.q(
        "Brainstorming or creating with them produces results neither of us would reach alone.",
      ),
      ids7.q(
        "We feed off each other's creativity, energy, or vision when working on something shared.",
      ),
      ids7.q(
        "The things we create together feel like they belong to both of us.",
      ),
    ]),

    ids7.c("Everyday Partner", [
      ids7.q(
        "We share routines, logistics, or daily life in a way that feels natural.",
      ),
      ids7.q(
        "Practical coordination between us \u2014 schedules, errands, household things \u2014 flows easily.",
      ),
      ids7.q(
        "They are woven into the ordinary texture of my days, not just the highlights.",
      ),
      ids7.q(
        "Sharing mundane, unremarkable time together feels valuable, not wasteful.",
      ),
    ]),

    // Safety
    ids7.c("Caretaker / Nurturer", [
      ids7.q(
        "I actively tend to their needs \u2014 cooking, checking in, noticing when something is off.",
      ),
      ids7.q("They actively tend to mine in the same way."),
      ids7.q(
        "Between us, there is a dynamic of looking after each other that goes beyond politeness.",
      ),
      ids7.q(
        "Caring for them feels like an expression of the connection, not an obligation.",
      ),
    ]),

    ids7.c("Anchor / Protector", [
      ids7.q(
        "Their presence makes uncertain or chaotic situations feel more manageable.",
      ),
      ids7.q(
        "I feel protective of them \u2014 wanting to shield them from harm or difficulty.",
      ),
      ids7.q("They feel protective of me in the same way."),
      ids7.q(
        'Between us, there is a sense of "I have your back" that does not need to be stated.',
      ),
    ]),

    // Depth
    ids7.c("Witness / Mirror", [
      ids7.q(
        "They see parts of me that I do not show most people \u2014 and I trust them with that.",
      ),
      ids7.q(
        "Being around them helps me see myself more clearly, including things I might not notice alone.",
      ),
      ids7.q("I see parts of them that others miss, and they know it."),
      ids7.q(
        "We reflect each other's truth back, even when it is uncomfortable or surprising.",
      ),
    ]),

    ids7.c("Family / Kin", [
      ids7.q(
        "They feel like family \u2014 chosen or otherwise \u2014 in a way that goes beyond friendship.",
      ),
      ids7.q(
        "There is a sense of permanence or unconditional belonging between us.",
      ),
      ids7.q(
        "Our bond feels like it would survive distance, disagreement, or long periods apart.",
      ),
      ids7.q(
        "The connection carries a weight or significance that feels foundational or kin-like.",
      ),
    ]),
  ],
  SharedConnectionAnswerOptions,
);

const Empty = Form.new("New Template", []);

const FormTemplates = [
  {
    id: "empty",
    name: "Empty",
    template: Empty.withDescription(
      "Start from a blank page and build your own conversation structure.",
    ),
  },
  {
    id: "pnp",
    name: "PnP Preferences",
    template: PenAndPaperTemplate.withDescription(
      "Compare play preferences, comfort zones, and expectations before a tabletop campaign.",
    ),
  },
  {
    id: "attraction_map",
    name: "Attraction Map",
    template: AttractionMapTemplate.withDescription(
      "Untangle the different kinds of attraction you notice so you can reflect with more nuance.",
    ),
  },
  {
    id: "shared_connection",
    name: "What's Between Us",
    template: SharedConnectionTemplate.withDescription(
      "Look at the texture of a connection: comfort, care, play, meaning, boundaries, and commitment.",
    ),
  },
  {
    id: "relational_dynamics",
    name: "How Do I See Us?",
    template: RelationalDynamicsTemplate.withDescription(
      "Explore the roles, dynamics, and patterns that shape how this relationship feels day to day.",
    ),
  },
  {
    id: "rel_menu",
    name: "Relationship Menu",
    template: RelationshipMenuLight.withDescription(
      "A lighter check-in for naming relationship expectations, priorities, and boundaries.",
    ),
  },
  {
    id: "rel_menu_adv",
    name: "Relationship Menu (Advanced)",
    template: RelationshipMenuAdvanced.withDescription(
      "A deeper relationship check-in with more detailed prompts across intimacy, logistics, care, autonomy, and future planning.",
    ),
  },
];

export default FormTemplates;
