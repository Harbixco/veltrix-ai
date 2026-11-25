import csv
import json
import os
from datetime import datetime, timedelta

# All 56 Posts strictly crafted to be UNDER 270 characters (safe from Twitter 280 weighted limit)
# Each has: Hook + Body + CTA/Emoji

CONCISE_POSTS = [
    # --- WEEK 1 ---
    # Day 1
    {
        "day": 1, "post_num": 1, "time": "09:00 AM", "category": "Positioning / Intro",
        "cta_type": "Engagement / Follow",
        "media_suggestion": "Clean, professional workspace photo or modern developer profile card.",
        "text": (
            "Most developers focus on *how* to code.\n"
            "I focus on *why* that code needs to exist.\n\n"
            "Hi, I’m Abiodun 👋 Frontend Engineer (React/TypeScript/UX).\n\n"
            "Over 28 days, I'm documenting practical React patterns & building UI that converts.\n\n"
            "Drop a comment to connect! 🚀"
        )
    },
    {
        "day": 1, "post_num": 2, "time": "07:00 PM", "category": "Engineering Mindset",
        "cta_type": "Question / Discussion",
        "media_suggestion": "Text graphic or clean diagram comparing Code vs Context.",
        "text": (
            "Writing code is easy. Understanding *why* you write it takes maturity.\n\n"
            "Junior: \"How do I build this?\"\n"
            "Senior:\n"
            "1. Who needs this?\n"
            "2. What bottleneck does it solve?\n"
            "3. What if it fails in prod?\n\n"
            "Context > code.\n\n"
            "Which question do you ask first? 💬"
        )
    },
    # Day 2
    {
        "day": 2, "post_num": 3, "time": "09:00 AM", "category": "Frontend Engineering",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Side-by-side graphic: Pretty UI vs Intuitive Functional UX.",
        "text": (
            "If a user needs instructions to navigate your app, your frontend failed.\n\n"
            "Great frontend engineering:\n"
            "• Loads fast on 3G\n"
            "• Zero cognitive load\n"
            "• Accessible to all\n"
            "• Graceful error states\n\n"
            "Pretty UI without intuitive UX is just decoration 📌"
        )
    },
    {
        "day": 2, "post_num": 4, "time": "07:00 PM", "category": "Business & UX",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Quote graphic or high-contrast stat card on bounce rates.",
        "text": (
            "Customers aren't abandoning your website because of price.\n"
            "They leave because your UX is confusing.\n\n"
            "In 3 seconds, users decide:\n"
            "• What do you do?\n"
            "• Where is pricing?\n"
            "• Can I trust you?\n\n"
            "If a competitor answers in 3s and you take 30s, they win. 🚀"
        )
    },
    # Day 3
    {
        "day": 3, "post_num": 5, "time": "09:00 AM", "category": "React Best Practice",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Ray.so snippet showing derived state vs useEffect anti-pattern.",
        "text": (
            "Stop using `useEffect` for derived values! It causes redundant re-renders.\n\n"
            "❌ Bad:\n"
            "useEffect(() => setFull(`${first} ${last}`), [first, last]);\n\n"
            "✅ Good:\n"
            "const full = `${first} ${last}`;\n\n"
            "Compute in render. Less state = fewer bugs 📌"
        )
    },
    {
        "day": 3, "post_num": 6, "time": "07:00 PM", "category": "Dev Growth & Career",
        "cta_type": "Question / Discussion",
        "media_suggestion": "Clean minimalist graphic: 30 Hours of Tutorials vs 1 Production App.",
        "text": (
            "Watching 30 hours of tutorials won't make you a developer.\n"
            "Building 1 messy project from scratch will.\n\n"
            "Tutorials give the illusion of competence without the pain of debugging.\n\n"
            "Close YouTube. Open your IDE. Break things. Fix them.\n\n"
            "What are you building right now? 👇"
        )
    },
    # Day 4
    {
        "day": 4, "post_num": 7, "time": "09:00 AM", "category": "Frontend UX & Performance",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Side-by-side Chrome DevTools screenshot: Desktop M2 Mac vs 3G Mobile Throttle.",
        "text": (
            "The most dangerous assumption in tech:\n"
            "\"It works for me, so it's fine.\"\n\n"
            "You test on a MacBook Pro with high-speed WiFi.\n"
            "Your user is on a $120 phone with 2 bars of 3G.\n\n"
            "Always throttle your network in DevTools.\n"
            "Performance is UX. Optimize early 📌"
        )
    },
    {
        "day": 4, "post_num": 8, "time": "07:00 PM", "category": "Business Conversion",
        "cta_type": "Engagement / Lead Gen",
        "media_suggestion": "Annotated landing page screenshot highlighting above-the-fold CTA placement.",
        "text": (
            "The #1 conversion killer on 90% of business sites:\n\n"
            "No clear CTA above the fold.\n\n"
            "If users must scroll past paragraphs of text just to figure out how to book or buy, you lost them.\n\n"
            "Put one clear action button front and center.\n\n"
            "Simplicity sells 🚀"
        )
    },
    # Day 5
    {
        "day": 5, "post_num": 9, "time": "09:00 AM", "category": "TypeScript Deep Dive",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Carbon.now.sh code card showing strict typing vs any.",
        "text": (
            "TypeScript isn't just about catching typos.\n"
            "It's living documentation and refactoring insurance.\n\n"
            "When you return to code 6 months later:\n"
            "• Strict types explain intent\n"
            "• Autocomplete prevents guesswork\n"
            "• Renaming props won't break prod\n\n"
            "Write strict TS today 📌"
        )
    },
    {
        "day": 5, "post_num": 10, "time": "07:00 PM", "category": "Portfolio & Career",
        "cta_type": "Community / Discussion",
        "media_suggestion": "Clean infographic comparing Shallow Tutorial Repos vs 2 Production Case Studies.",
        "text": (
            "Stop collecting certificates like Pokémon cards.\n\n"
            "Build 2 production-grade apps instead of 15 tutorial clones:\n"
            "• Real database & auth\n"
            "• Responsive UI & error states\n"
            "• Live deployed URL\n\n"
            "Hiring managers want problem-solvers, not tutorial copiers 💬"
        )
    },
    # Day 6
    {
        "day": 6, "post_num": 11, "time": "09:00 AM", "category": "Performance & Web Vitals",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Core Web Vitals scorecard graphic with green 95+ performance metrics.",
        "text": (
            "Nobody cares how clean your code is if your site takes 7 seconds to load.\n\n"
            "A 1-second delay cuts conversions by 7%.\n\n"
            "Quick wins:\n"
            "1. Compress images to WebP/AVIF\n"
            "2. Lazy load below the fold\n"
            "3. Code-split heavy routes\n\n"
            "Speed is direct revenue optimization 📌"
        )
    },
    {
        "day": 6, "post_num": 12, "time": "07:00 PM", "category": "Community Question",
        "cta_type": "Question / Reply Bait",
        "media_suggestion": "Quote graphic: 'Advice to Day 1 Self'.",
        "text": (
            "If you could travel back to Day 1 of your software engineering journey, what ONE piece of advice would you give yourself?\n\n"
            "Mine: Learn how the browser works before memorizing 5 different frameworks.\n\n"
            "What's yours? Drop it below! 👇"
        )
    },
    # Day 7
    {
        "day": 7, "post_num": 13, "time": "09:00 AM", "category": "Engineering Culture",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Diagram comparing Junior vs Mid vs Senior Engineer decision priorities.",
        "text": (
            "Senior engineers aren't walking documentation libraries.\n\n"
            "They know when NOT to write code:\n"
            "• Junior: Builds 500 lines of custom logic\n"
            "• Senior: Solves it with 3 lines of CSS or existing browser API\n\n"
            "The best code is the code you never had to write 🚀"
        )
    },
    {
        "day": 7, "post_num": 14, "time": "07:00 PM", "category": "Week 1 Reflection",
        "cta_type": "Engagement / Community",
        "media_suggestion": "Clean visual graphic: 7 Days of Frontend Insights Recapped.",
        "text": (
            "Week 1 of 4 completed! 🚀\n\n"
            "My biggest takeaway:\n"
            "Code is only a tool. The real value is solving human and business bottlenecks.\n\n"
            "Thank you to everyone connecting and replying this week!\n\n"
            "What was your biggest tech win this week? Drop it below! 💬"
        )
    },

    # --- WEEK 2 ---
    # Day 8
    {
        "day": 8, "post_num": 15, "time": "09:00 AM", "category": "Architecture & Code Quality",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Code architecture diagram showing flat vs over-nested components.",
        "text": (
            "Premature abstraction is the root of all evil in frontend.\n\n"
            "Don't build a generic `<SuperButton />` with 47 props for a button used in 2 places.\n\n"
            "Duplication is far cheaper than the wrong abstraction.\n\n"
            "Build for today. Refactor when you see 3 identical use cases 📌"
        )
    },
    {
        "day": 8, "post_num": 16, "time": "07:00 PM", "category": "Business Mindset",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Contrast card: Order Taker vs Strategic Product Partner.",
        "text": (
            "A great engineer doesn't just take orders. They question requirements:\n\n"
            "\"Why do users need this?\"\n"
            "\"What metric are we moving?\"\n"
            "\"Is there a simpler way to test this?\"\n\n"
            "When you care about business outcomes, you become an indispensable partner 🚀"
        )
    },
    # Day 9
    {
        "day": 9, "post_num": 17, "time": "09:00 AM", "category": "Tech Stack Wisdom",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Hierarchy diagram: HTML/CSS/JS fundamentals at base, Frameworks at top.",
        "text": (
            "Learning 5 frameworks won't make you senior.\n\n"
            "Master 4 fundamentals instead:\n"
            "1. JS event loop & closures\n"
            "2. DOM rendering & CSS layout\n"
            "3. Network protocols & HTTP cache\n"
            "4. Web accessibility (HTML/ARIA)\n\n"
            "Frameworks change. Core basics don't 📌"
        )
    },
    {
        "day": 9, "post_num": 18, "time": "07:00 PM", "category": "Sales & UX",
        "cta_type": "Engagement / Lead Gen",
        "media_suggestion": "Funnel graphic illustrating 60% drop-off at checkout vs streamlined 1-click checkout.",
        "text": (
            "You don't need more ad traffic.\n"
            "You need to fix checkout friction.\n\n"
            "If your mobile checkout has 14 required fields, users leave.\n\n"
            "Every extra field cuts conversion by ~5%.\n"
            "Cut the noise. Make buying effortless.\n\n"
            "How many steps is your checkout? 💬"
        )
    },
    # Day 10
    {
        "day": 10, "post_num": 19, "time": "09:00 AM", "category": "Debugging & Problem Solving",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Flowchart: 4-step scientific debugging process.",
        "text": (
            "Randomly changing code until an error disappears isn't debugging. It's guessing.\n\n"
            "The 4-step debugging framework:\n"
            "1. Reproduce reliably\n"
            "2. Isolate the layer (network, state, render)\n"
            "3. Form a hypothesis\n"
            "4. Verify the fix\n\n"
            "Save hours of frustration 📌"
        )
    },
    {
        "day": 10, "post_num": 20, "time": "07:00 PM", "category": "Leadership & Collaboration",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Team dynamics quote card: 'High-performing teams disagree constructively'.",
        "text": (
            "The best engineering teams don't avoid disagreement.\n"
            "They debate technical trade-offs openly:\n\n"
            "• Challenge code, never the person\n"
            "• Ground arguments in performance & DX\n"
            "• Disagree, then fully commit\n\n"
            "Strong opinions, loosely held. That's real teamwork 🤝"
        )
    },
    # Day 11
    {
        "day": 11, "post_num": 21, "time": "09:00 AM", "category": "Responsive Design",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Visual breakdown: True responsive mobile UX vs scaled-down desktop UI.",
        "text": (
            "Responsive design is NOT shrinking a desktop UI to fit mobile.\n\n"
            "Mobile is a distinct experience:\n"
            "• Thumb-friendly touch targets (min 48px)\n"
            "• Bottom-sheet navigation\n"
            "• Native input types (`type=\"tel\"`)\n\n"
            "80% of web traffic is mobile. Design mobile-first 📌"
        )
    },
    {
        "day": 11, "post_num": 22, "time": "07:00 PM", "category": "Conversion Optimization",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Metaphor illustration: Pouring water into a leaky bucket.",
        "text": (
            "Pouring traffic into a website with poor UX is like filling a leaky bucket.\n\n"
            "Before spending another $500 on ads:\n"
            "1. Test site speed on 3G\n"
            "2. Clarify your headline & CTA\n"
            "3. Fix broken mobile buttons\n\n"
            "Plug the leaks first. Growth follows 🚀"
        )
    },
    # Day 12
    {
        "day": 12, "post_num": 23, "time": "09:00 AM", "category": "State Management",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "State architecture diagram: Server State vs URL State vs Local State vs Global State.",
        "text": (
            "You probably don't need Redux or global state for that app.\n\n"
            "Modern state belongs in 3 places:\n"
            "1. URL params: Filters, tabs, search\n"
            "2. Server state: React Query / SWR (caching)\n"
            "3. Local state: `useState` inside components\n\n"
            "Keep state as local as possible 📌"
        )
    },
    {
        "day": 12, "post_num": 24, "time": "07:00 PM", "category": "Hiring & Recruitment",
        "cta_type": "Question / Discussion",
        "media_suggestion": "Question prompt graphic for tech hiring managers.",
        "text": (
            "To Engineering Managers & Tech Recruiters:\n\n"
            "What is the #1 green flag you look for when reviewing a frontend developer's code or portfolio?\n\n"
            "Is it architecture, clean Git history, live deployed projects, or communication?\n\n"
            "I'd love your insight below! 💬"
        )
    },
    # Day 13
    {
        "day": 13, "post_num": 25, "time": "09:00 AM", "category": "Accessibility & SEO",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Visual comparison: `div onClick` vs proper `<button>` with keyboard focus indicators.",
        "text": (
            "Accessibility isn't an optional feature. It's engineering hygiene.\n\n"
            "Semantic HTML gives you for free:\n"
            "• Keyboard navigation (`Tab`, `Enter`)\n"
            "• Screen-reader support\n"
            "• Higher Google SEO rank\n\n"
            "Stop replacing `<button>` with `<div onClick>`. Use real HTML 📌"
        )
    },
    {
        "day": 13, "post_num": 26, "time": "07:00 PM", "category": "Soft Skills & Career",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Quote card: 'Code gets you hired. Communication gets you promoted.'",
        "text": (
            "A 10x developer who can’t communicate clearly is effectively a 1x developer.\n\n"
            "Great engineers:\n"
            "• Write concise PR summaries\n"
            "• Explain trade-offs in plain English\n"
            "• Proactively flag blockers\n\n"
            "Technical skill is baseline. Clear communication is your superpower 🚀"
        )
    },
    # Day 14
    {
        "day": 14, "post_num": 27, "time": "09:00 AM", "category": "Portfolio Proof",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Case study template layout: Problem → Solution → Technical Trade-offs → Business Result.",
        "text": (
            "Your portfolio shouldn't just be pretty landing page screenshots.\n\n"
            "Turn your projects into case studies:\n"
            "• What real problem did it solve?\n"
            "• Which trade-offs did you make?\n"
            "• What metrics improved?\n\n"
            "Don't show code. Show business impact 📌"
        )
    },
    {
        "day": 14, "post_num": 28, "time": "07:00 PM", "category": "Week 2 Milestone",
        "cta_type": "Community / Networking",
        "media_suggestion": "Milestone badge graphic: Day 14 / Halfway through 28-day campaign.",
        "text": (
            "Day 14. Halfway through my 28-day frontend engineering series! 🚀\n\n"
            "Top lesson so far:\n"
            "The community rewards practical, no-nonsense engineering over buzzword hype.\n\n"
            "If you build digital products or manage tech teams, let's connect!\n\n"
            "Say hi below 👇"
        )
    },

    # --- WEEK 3 ---
    # Day 15
    {
        "day": 15, "post_num": 29, "time": "09:00 AM", "category": "Tech Stack Reality",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Minimalist graphic: User Needs (Fast, Functional, Reliable) vs Tech Stack Choice.",
        "text": (
            "Users don't care if your app is Next.js, Remix, or vanilla JS.\n\n"
            "They care about 3 things:\n"
            "1. Did it solve my problem?\n"
            "2. Was it fast and bug-free?\n"
            "3. Was it easy to use?\n\n"
            "Build with tools you master. Ship value, not framework hype 🚀"
        )
    },
    {
        "day": 15, "post_num": 30, "time": "07:00 PM", "category": "Business UX Audit",
        "cta_type": "Engagement / Lead Gen",
        "media_suggestion": "Checklist card: 3-point mobile usability check for business websites.",
        "text": (
            "Business owners: Open your website on your phone right now.\n\n"
            "Check 3 things:\n"
            "1. Can you tap your phone/WhatsApp button in 1 click?\n"
            "2. Does it load in under 3 seconds?\n"
            "3. Is text readable without zooming?\n\n"
            "If not, your site is losing money daily. Fix it 💬"
        )
    },
    # Day 16
    {
        "day": 16, "post_num": 31, "time": "09:00 AM", "category": "Error Handling & UX",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "UI card comparison: Cryptic '500 Server Error' vs Helpful friendly fallback UI.",
        "text": (
            "A great frontend isn’t just how your app looks when things go right.\n\n"
            "It’s how it behaves when things go wrong:\n"
            "• Actionable error messages\n"
            "• Retry buttons on failed API calls\n"
            "• Offline indicators\n\n"
            "Never leave users on a blank screen. Design resilient UI 📌"
        )
    },
    {
        "day": 16, "post_num": 32, "time": "07:00 PM", "category": "Junior Dev Advice",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Quote card: 'Read documentation like a detective'.",
        "text": (
            "Best advice for frontend devs:\n\n"
            "Spend less time watching tutorials and more time reading official documentation.\n\n"
            "Tutorials teach someone else's opinion.\n"
            "Docs teach how the technology actually works under the hood.\n\n"
            "Level up your craft. Read the docs 🚀"
        )
    },
    # Day 17
    {
        "day": 17, "post_num": 33, "time": "09:00 AM", "category": "Clean Code",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Side-by-side code snippet: Clever complex regex vs Simple readable function.",
        "text": (
            "Clean code isn't code that looks clever.\n"
            "Clean code is code that's effortless to delete.\n\n"
            "• Clear variable names > clever tricks\n"
            "• Pure predictable functions\n"
            "• Obvious code paths\n\n"
            "Write code for the next engineer who will maintain it at 2:00 AM 📌"
        )
    },
    {
        "day": 17, "post_num": 34, "time": "07:00 PM", "category": "Business Automation",
        "cta_type": "Engagement / Lead Gen",
        "media_suggestion": "Workflow diagram: Manual WhatsApp copy-paste vs Automated CRM booking.",
        "text": (
            "Small businesses don't need million-dollar custom enterprise software.\n\n"
            "They need simple, robust workflows:\n"
            "• Direct WhatsApp lead capture\n"
            "• Instant automated quotes\n"
            "• Clean mobile payment checkouts\n\n"
            "Automate manual bottlenecks. Save 10+ hours a week 🚀"
        )
    },
    # Day 18
    {
        "day": 18, "post_num": 35, "time": "09:00 AM", "category": "Project Structure",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Folder tree comparison: Feature-based architecture vs Type-based folder structure.",
        "text": (
            "Organizing React by `components/`, `hooks/`, `utils/` breaks down at scale.\n\n"
            "Organize by feature instead:\n"
            "📁 features/auth/\n"
            "  ├── components/\n"
            "  ├── hooks/\n"
            "  └── api/\n\n"
            "When deleting a feature, delete one folder. Modular & scalable 📌"
        )
    },
    {
        "day": 18, "post_num": 36, "time": "07:00 PM", "category": "Interview Prep",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Checklist: 4-step communication framework for coding interviews.",
        "text": (
            "How to ace frontend interviews without memorizing LeetCode:\n\n"
            "1. Clarify constraints before coding\n"
            "2. Think aloud so they see your problem-solving\n"
            "3. Mention trade-offs & edge cases\n"
            "4. Ask how their team operates\n\n"
            "They hire teammates, not compilers 💬"
        )
    },
    # Day 19
    {
        "day": 19, "post_num": 37, "time": "09:00 AM", "category": "Why Frontend",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Personal quote card: 'Frontend is where human psychology meets engineering logic'.",
        "text": (
            "Why I chose Frontend Engineering:\n\n"
            "You touch human psychology and business impact directly.\n\n"
            "A backend database optimization is great.\n"
            "But a seamless UI checkout actually converts visitors into paying customers.\n\n"
            "Frontend is the bridge to the user 🚀"
        )
    },
    {
        "day": 19, "post_num": 38, "time": "07:00 PM", "category": "Founder Question",
        "cta_type": "Question / Lead Gen",
        "media_suggestion": "Discussion card for founders: 'What is your biggest tech bottleneck?'",
        "text": (
            "To startup founders and business owners:\n\n"
            "What is the single biggest technical or UX bottleneck holding your business back right now?\n\n"
            "Slow website? High bounce rates? Broken mobile checkout?\n\n"
            "Drop it below. Let’s diagnose it together! 💬"
        )
    },
    # Day 20
    {
        "day": 20, "post_num": 39, "time": "09:00 AM", "category": "Perceived Performance",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Visual comparison: Skeleton screen loading state vs annoying full-screen spinner.",
        "text": (
            "Never leave users staring at a blank white screen.\n\n"
            "Perceived performance matters as much as actual load speed:\n"
            "• Use skeleton screens\n"
            "• Show optimistic UI updates\n"
            "• Disable buttons with loaders on click\n\n"
            "Responsive feedback builds user trust 📌"
        )
    },
    {
        "day": 20, "post_num": 40, "time": "07:00 PM", "category": "Continuous Learning",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Quote card: 'The best skill in tech is knowing how to learn fast'.",
        "text": (
            "You don't need to know everything to be an exceptional software engineer.\n\n"
            "You just need to know how to:\n"
            "1. Read error stacks patiently\n"
            "2. Ask precise questions\n"
            "3. Isolate variables systematically\n\n"
            "Resourcefulness beats memorization every time 🚀"
        )
    },
    # Day 21
    {
        "day": 21, "post_num": 41, "time": "09:00 AM", "category": "Full-Stack Empathy",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Architectural diagram showing Frontend REST/GraphQL query aligned with Backend DB indices.",
        "text": (
            "A frontend engineer who understands backend data modeling is 3x more valuable.\n\n"
            "When you understand:\n"
            "• API pagination costs\n"
            "• DB query indexing\n"
            "• Cache headers (ETag, max-age)\n\n"
            "You build lighter, faster apps that backend devs love 📌"
        )
    },
    {
        "day": 21, "post_num": 42, "time": "07:00 PM", "category": "Ego in Tech",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Quote graphic: 'Detach your ego from your pull requests'.",
        "text": (
            "Your code is not your identity.\n\n"
            "Detach your ego from your pull requests:\n"
            "• PR comments are improvements, not personal attacks\n"
            "• Welcome critique with curiosity\n"
            "• Be happy when someone points out an edge case\n\n"
            "Growth starts where defensiveness ends 🤝"
        )
    },

    # --- WEEK 4 ---
    # Day 22
    {
        "day": 22, "post_num": 43, "time": "09:00 AM", "category": "AI in Engineering",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Infographic: AI as an Engineering Multiplier, not replacement.",
        "text": (
            "AI won't replace software engineers.\n"
            "Engineers who leverage AI will replace those who don't.\n\n"
            "Use AI to:\n"
            "• Generate boilerplate & regex\n"
            "• Brainstorm edge cases\n"
            "• Write unit tests\n\n"
            "Keep the architecture & problem-solving in human hands 🚀"
        )
    },
    {
        "day": 22, "post_num": 44, "time": "07:00 PM", "category": "Website ROI",
        "cta_type": "Engagement / Lead Gen",
        "media_suggestion": "Comparison card: Static Brochure vs High-Converting Digital Sales Engine.",
        "text": (
            "An online brochure costs money.\n"
            "A conversion-optimized website prints money.\n\n"
            "If your website doesn't capture leads or make booking frictionless, it's an expense, not an asset.\n\n"
            "Transform your web presence into your best salesperson 🚀"
        )
    },
    # Day 23
    {
        "day": 23, "post_num": 45, "time": "09:00 AM", "category": "Framework Mastery",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Mindmap diagram: How to deconstruct and master any new framework in 48 hours.",
        "text": (
            "How to master a new framework in 48 hours:\n\n"
            "1. Understand its mental model\n"
            "2. Learn how it handles state & routing\n"
            "3. Inspect its reactivity system\n"
            "4. Build a CRUD app without tutorials\n\n"
            "Understand the design philosophy first 📌"
        )
    },
    {
        "day": 23, "post_num": 46, "time": "07:00 PM", "category": "Networking",
        "cta_type": "Community / Follow",
        "media_suggestion": "Clean connect card: Profile snapshot of AbiodunBuilds.",
        "text": (
            "Building my network on tech X! 🌐\n\n"
            "I'm looking to connect with:\n"
            "• React & TypeScript developers\n"
            "• Founders scaling web products\n"
            "• Engineering hiring managers\n\n"
            "If you build high-performance software, drop a comment or follow. Let's connect! 👋"
        )
    },
    # Day 24
    {
        "day": 24, "post_num": 47, "time": "09:00 AM", "category": "Code Review Culture",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Checklist: High-empathy Code Review Guidelines for Engineering Teams.",
        "text": (
            "A great code review shouldn't feel like an interrogation.\n\n"
            "Healthy PR habits:\n"
            "• Praise clever solutions\n"
            "• Explain *why*, not just *what*\n"
            "• Label comments: [Nit], [Question], [Blocking]\n\n"
            "Code reviews are mentorship opportunities, not gatekeeping 📌"
        )
    },
    {
        "day": 24, "post_num": 48, "time": "07:00 PM", "category": "Business Platform Risk",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Metaphor card: Building on Rented Land (Social Media) vs Owned Digital Asset (Website).",
        "text": (
            "Building your entire business on Instagram or TikTok is building on rented land.\n\n"
            "One algorithm tweak or account suspension can wipe out your pipeline.\n\n"
            "Own your platform:\n"
            "• A fast, dedicated website\n"
            "• An owned email list\n\n"
            "Own your customer relationships 🚀"
        )
    },
    # Day 25
    {
        "day": 25, "post_num": 49, "time": "09:00 AM", "category": "Frontend Security",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Security audit diagram: What gets bundled into client JS vs Server-only secrets.",
        "text": (
            "Frontend developers: Never hide secrets in client code.\n\n"
            "Any `NEXT_PUBLIC_` or Vite `VITE_` env variable is visible to anyone opening Chrome DevTools.\n\n"
            "• Never put secret API keys in frontend\n"
            "• Always validate forms on backend too\n\n"
            "Frontend security matters 📌"
        )
    },
    {
        "day": 25, "post_num": 50, "time": "07:00 PM", "category": "Professional Networking",
        "cta_type": "Thought Leadership",
        "media_suggestion": "Quote graphic: 'Build your network before you need it'.",
        "text": (
            "The biggest mistake in professional networking:\n\n"
            "Only reaching out when you desperately need a job.\n\n"
            "Build authentic relationships beforehand:\n"
            "• Share your learnings publicly\n"
            "• Help others solve bugs\n"
            "• Celebrate others' wins\n\n"
            "Opportunities flow to generous builders 🤝"
        )
    },
    # Day 26
    {
        "day": 26, "post_num": 51, "time": "09:00 AM", "category": "Software Realities",
        "cta_type": "Community / Discussion",
        "media_suggestion": "Humorous reality chart: 10% Writing Code vs 90% Reading Documentation & Debugging.",
        "text": (
            "Software engineering in reality:\n\n"
            "• 30 mins: Writing new code\n"
            "• 2 hours: Reading documentation\n"
            "• 3 hours: Debugging why one prop is undefined\n\n"
            "Don't feel like an imposter. That's what real engineering looks like!\n\n"
            "Who can relate? 😂💬"
        )
    },
    {
        "day": 26, "post_num": 52, "time": "07:00 PM", "category": "Founder Engagement",
        "cta_type": "Question / Lead Gen",
        "media_suggestion": "Discussion card: 'The #1 website element founders want to overhaul'.",
        "text": (
            "To business owners and founders:\n\n"
            "If you could fix ONE thing on your website by tomorrow morning without spending a dime, what would it be?\n\n"
            "Speed? Mobile layout? Higher checkout conversion?\n\n"
            "Drop your site link or bottleneck below for quick feedback! 👇"
        )
    },
    # Day 27
    {
        "day": 27, "post_num": 53, "time": "09:00 AM", "category": "Maintainability",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Architecture card: Easy to read, easy to modify, easy to delete.",
        "text": (
            "Getting code to work is step one.\n"
            "Getting code to be maintainable is what makes you senior.\n\n"
            "Before opening a PR, ask:\n"
            "\"Can someone with zero context understand this in 5 minutes?\"\n\n"
            "If the answer is no, simplify.\n\n"
            "Write code for humans first, computers second 📌"
        )
    },
    {
        "day": 27, "post_num": 54, "time": "07:00 PM", "category": "Recruiter Insights",
        "cta_type": "Question / Community",
        "media_suggestion": "Discussion card for engineering recruiters and hiring managers.",
        "text": (
            "To tech recruiters & engineering managers:\n\n"
            "When reviewing frontend candidate portfolios, what is your biggest instant RED flag?\n\n"
            "Broken live links? Unresponsive mobile layouts? Zero commit history?\n\n"
            "Help the developer community level up below! 💬"
        )
    },
    # Day 28
    {
        "day": 28, "post_num": 55, "time": "09:00 AM", "category": "Delivery Framework",
        "cta_type": "Bookmark / Save",
        "media_suggestion": "Visual roadmap: My 6-Step End-to-End Product Engineering Framework.",
        "text": (
            "My 6-step framework for shipping products:\n\n"
            "1. Clarify user outcome\n"
            "2. Map data models & APIs\n"
            "3. Design responsive mobile UI\n"
            "4. Implement resilient state logic\n"
            "5. Optimize performance & SEO\n"
            "6. Measure user conversion\n\n"
            "Ship fast, ship resilient 📌"
        )
    },
    {
        "day": 28, "post_num": 56, "time": "07:00 PM", "category": "Campaign Finale",
        "cta_type": "Engagement / Lead Gen",
        "media_suggestion": "Master summary infographic: 28 Days of Frontend Engineering Recapped.",
        "text": (
            "28 days. 56 posts. One mission:\n\n"
            "To bridge technical engineering with real business conversion.\n\n"
            "Thank you to everyone who followed, commented, and shared!\n\n"
            "Need a high-converting web app or performance audit? DM me or let's connect!\n\n"
            "Onward to the next build 🚀"
        )
    }
]

# Verify lengths of all 56 posts
print(f"Total concise posts: {len(CONCISE_POSTS)}")
over_limit = []
for p in CONCISE_POSTS:
    char_len = len(p["text"])
    if char_len > 270:
        over_limit.append((p["post_num"], char_len, p["text"]))

if over_limit:
    print(f"ERROR: {len(over_limit)} posts exceed 270 characters!")
    for num, clen, txt in over_limit:
        print(f"Post {num} has {clen} chars: {txt!r}")
    exit(1)
else:
    print("SUCCESS: ALL 56 POSTS ARE <= 270 CHARACTERS! 100% COMPLIANT WITH X & BUFFER!")

# Scheduling dates: Starting tomorrow, Thursday November 26, 2026
start_date = datetime(2026, 11, 26)
fieldnames = ["Text", "Image URL", "Tags", "Posting Time"]

buffer_rows = []
csv_schedule_rows = []

for idx, p in enumerate(CONCISE_POSTS):
    day_offset = p["day"] - 1
    post_date = start_date + timedelta(days=day_offset)
    date_str = post_date.strftime("%Y-%m-%d")
    
    is_morning = "AM" in p["time"]
    time_24 = "09:00" if is_morning else "19:00"
    posting_time = f"{date_str} {time_24}"
    
    buffer_rows.append({
        "Text": p["text"],
        "Image URL": "",
        "Tags": "AbiodunBuilds",
        "Posting Time": posting_time
    })
    
    csv_schedule_rows.append({
        "Date": date_str,
        "Time": p["time"],
        "Day": f"Day {p['day']}",
        "Post_Number": f"Post {p['post_num']}",
        "Category": p["category"],
        "CTA_Type": p["cta_type"],
        "Media_Suggestion": p["media_suggestion"],
        "Post_Text": p["text"]
    })

# Write master Buffer CSV
master_output = "content/buffer_all_56_posts.csv"
with open(master_output, mode="w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
    writer.writeheader()
    writer.writerows(buffer_rows)
print(f"Wrote {master_output}")

with open("content/buffer_all_56_posts_starting_today.csv", mode="w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
    writer.writeheader()
    writer.writerows(buffer_rows)

# Write 10-post Batches for Buffer Free plan
batch_size = 10
batch_dir = "content/buffer_batches"
os.makedirs(batch_dir, exist_ok=True)

num_batches = (len(buffer_rows) + batch_size - 1) // batch_size
for i in range(num_batches):
    batch_slice = buffer_rows[i*batch_size : (i+1)*batch_size]
    start_num = i*batch_size + 1
    end_num = min((i+1)*batch_size, len(buffer_rows))
    batch_filename = f"{batch_dir}/buffer_batch_{i+1}_posts_{start_num}_to_{end_num}.csv"
    with open(batch_filename, mode="w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(batch_slice)
    print(f"Wrote {batch_filename} ({len(batch_slice)} posts)")

# Write updated x_schedule_buffer_typefully.csv
schedule_fieldnames = ["Date", "Time", "Day", "Post_Number", "Category", "CTA_Type", "Media_Suggestion", "Post_Text"]
with open("content/x_schedule_buffer_typefully.csv", mode="w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=schedule_fieldnames, quoting=csv.QUOTE_ALL)
    writer.writeheader()
    writer.writerows(csv_schedule_rows)
print("Updated content/x_schedule_buffer_typefully.csv")

# Save concise posts to json
with open("content/concise_posts.json", "w", encoding="utf-8") as f:
    json.dump(CONCISE_POSTS, f, indent=2)

print("All Buffer and schedule files updated successfully!")
