import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const BG_MAIN = "https://cdn.poehali.dev/projects/cc218517-5c8c-43ba-8e51-4c21f62c0ec0/files/88dbb5a6-39c1-42c5-a8e9-632ade825c5f.jpg";
const IMG_BATTLE = "https://cdn.poehali.dev/projects/cc218517-5c8c-43ba-8e51-4c21f62c0ec0/files/23e90129-8892-40cd-96b7-0203ca82117a.jpg";

type Screen = "menu" | "novel" | "battle" | "gallery" | "quests" | "relations" | "inventory" | "saves";

const CHARACTERS = [
  { id: 1,  name: "Соник",    role: "Герой скорости",       color: "#00b4d8", emoji: "💙", relation: 85, faction: "Освободительный фронт", desc: "Непобедимый бегун Мобиуса. Сердце команды и символ свободы. Никогда не останавливается — ни в бою, ни в жизни.", portrait: "🦔", isAdult: false },
  { id: 2,  name: "Тейлз",   role: "Гений механики",        color: "#ffd60a", emoji: "💛", relation: 92, faction: "Освободительный фронт", desc: "Двухвостый лисёнок, мастер технологий и пилот Биплана. IQ за 300, сердце — золото.", portrait: "🦊", isAdult: false },
  { id: 3,  name: "Наклз",   role: "Страж Изумруда",        color: "#e63946", emoji: "❤️", relation: 60, faction: "Нейтрал",                desc: "Хранитель Мастер Изумруда. Сила, честь и немного упрямства. Один удар его кулаков раскалывает скалы.", portrait: "🦔", isAdult: false },
  { id: 4,  name: "Эми",     role: "Боец молота",           color: "#ff006e", emoji: "🌸", relation: 78, faction: "Освободительный фронт", desc: "Розовый ёж с несгибаемой волей и огромным молотом. Страстная, дерзкая, опасно привлекательная — и она прекрасно это знает.", portrait: "🌸", isAdult: true },
  { id: 5,  name: "Шэдоу",   role: "Ultima Hedgehog",       color: "#9b5de5", emoji: "💜", relation: 35, faction: "Неизвестно",             desc: "Тёмный двойник Соника. Живёт в тени, но сражается за правду. За его холодностью скрывается буря.", portrait: "🖤", isAdult: false },
  { id: 6,  name: "Руж",     role: "Агент G.U.N.",          color: "#ff79c6", emoji: "🦇", relation: 48, faction: "G.U.N.",                 desc: "Летучая мышь — воровка драгоценностей и профессиональный шпион. Мастер соблазна и манипуляций. Никогда не понять, где правда, а где игра.", portrait: "🦇", isAdult: true },
  { id: 7,  name: "Салли",   role: "Принцесса-командир",    color: "#8b5cf6", emoji: "🐿️", relation: 55, faction: "Освободительный фронт", desc: "Принцесса Акорн и лидер повстанцев. Стратег с железной волей, умеет убедить кого угодно — взглядом или приказом.", portrait: "👑", isAdult: true },
  { id: 8,  name: "Блейз",   role: "Страж Солнечного камня",color: "#f97316", emoji: "🔥", relation: 42, faction: "Сол-Измерение",          desc: "Кошка из другого измерения. Контролирует пламя, держится холодно — но огонь внутри не гасится никогда.", portrait: "🐱", isAdult: true },
  { id: 9,  name: "Волнушка",role: "Механик-пират",         color: "#06b6d4", emoji: "🌊", relation: 33, faction: "Пираты Штормовых Морей",  desc: "Ехидна-пиратка с острым умом и ещё более острым языком. Чинит технику так же легко, как ломает сердца.", portrait: "🏴‍☠️", isAdult: true },
  { id: 10, name: "Серебро",  role: "Телекинетик из будущего",color: "#c0c0c0", emoji: "⚡", relation: 50, faction: "Будущее",               desc: "Молодой ёж из апокалиптического будущего. Наивен, но его психокинетическая сила способна останавливать танки.", portrait: "🔮", isAdult: false },
  { id: 11, name: "Эспио",   role: "Ниндзя-хамелеон",       color: "#a855f7", emoji: "🥷", relation: 38, faction: "Детектив Хаотик",        desc: "Бесшумный и невидимый ниндзя. Мало говорит, много знает. Его лезвие находит цель раньше, чем враг успевает моргнуть.", portrait: "🦎", isAdult: false },
  { id: 12, name: "Марин",   role: "Авантюристка морей",     color: "#10b981", emoji: "🐾", relation: 65, faction: "Сол-Измерение",          desc: "Неугомонная енотовидная собачка. Громкая, дерзкая и обожает приключения. Лучший друг Блейз — и её полная противоположность.", portrait: "🌊", isAdult: false },
];

const STORY_SCENES = [
  {
    id: 1, bg: "linear-gradient(180deg, #0a0f1e 0%, #1a2a4a 100%)",
    speaker: "Повествователь", speakerColor: "#aaaaaa",
    text: "Мобиус. Планета на краю гибели. Доктор Эггман захватил стратегические узлы и развернул танковые колонны вглубь Зелёных Холмов. Последние свободные зоны держатся из последних сил...",
    choices: [], next: 2,
  },
  {
    id: 2, bg: "linear-gradient(180deg, #0d1b2a 0%, #1a3a2a 100%)",
    speaker: "Соник", speakerColor: "#00b4d8",
    text: "Тейлз, засёк сигнал! Эггман поднял бронедивизион прямо у Станции Казино. Нам надо действовать быстро — иначе к ночи там будут руины.",
    choices: [
      { text: "🔥 Атакуем немедленно!", next: 3, effect: "+10 Храбрость · +Соник" },
      { text: "🧠 Сначала разведка", next: 4, effect: "+10 Интеллект · +Тейлз" },
      { text: "💬 Спросить Эми", next: 5, effect: "+Relations · +Эми" },
    ], next: 3,
  },
  {
    id: 3, bg: "linear-gradient(180deg, #1a0a0a 0%, #2a1a0a 100%)",
    speaker: "Тейлз", speakerColor: "#ffd60a",
    text: "С-Соник, подожди! Я запеленговал три танка серии «Эгг-Нокер» и... что-то ещё. Крупнее. Моя база данных такое не классифицирует. Будь осторожен!",
    choices: [], next: 6,
  },
  {
    id: 4, bg: "linear-gradient(180deg, #0a1a0a 0%, #1a2a1a 100%)",
    speaker: "Тейлз", speakerColor: "#ffd60a",
    text: "Отличное решение. Я запускаю дрон-разведчик... Вижу три танка «Эгг-Нокер», два патрульных робота и — подожди — там есть командный модуль. Если уничтожим его, вся дивизия встанет.",
    choices: [
      { text: "🎯 Цель — командный модуль", next: 6, effect: "+Тактика · +Тейлз" },
      { text: "💥 Бьём всех подряд", next: 6, effect: "+Сила" },
    ], next: 6,
  },
  {
    id: 5, bg: "linear-gradient(180deg, #1a0a10 0%, #2a0a18 100%)",
    speaker: "Эми", speakerColor: "#ff006e",
    text: "О, ты спрашиваешь моего мнения? Наконец-то~ Я уже разведала периметр, пока вы тут совещались. Трое охранников на западе зевают. Мой молот давно чешется...",
    choices: [
      { text: "😏 «Ты всегда на шаг впереди»", next: 6, effect: "+Эми значительно 💕" },
      { text: "😅 «Эми, это было опасно!»", next: 6, effect: "+Эми немного" },
    ], next: 6,
  },
  {
    id: 6, bg: "linear-gradient(180deg, #1a0a1a 0%, #0a0a2a 100%)",
    speaker: "Шэдоу", speakerColor: "#9b5de5",
    text: "...Я уже здесь. Не думай, что я пришёл помогать тебе, ёж. Просто наши цели совпадают на этот раз. Не мешайся под ногами.",
    choices: [
      { text: "👊 «Мне всё равно, лишь бы ты дрался»", next: 7, effect: "+Шэдоу немного" },
      { text: "🤝 «Добро пожаловать в команду»", next: 7, effect: "+Шэдоу значительно" },
      { text: "❌ «Убирайся»", next: 7, effect: "-Шэдоу · +Соник" },
    ], next: 7,
  },
  {
    id: 7, bg: "linear-gradient(180deg, #0f0a1a 0%, #1a0f2a 100%)",
    speaker: "Руж", speakerColor: "#ff79c6",
    text: "Мальчики, мальчики... Пока вы меряетесь харизмой, я уже скопировала чертежи командного модуля прямо из сервера G.U.N. Что бы вы без меня делали~",
    choices: [
      { text: "😍 «Руж, ты просто невероятна»", next: 8, effect: "+Руж значительно 💕" },
      { text: "🤨 «Ты нарушила протокол»", next: 8, effect: "-Руж · +Шэдоу" },
      { text: "😏 «Ожидаемо от тебя»", next: 8, effect: "+Руж немного" },
    ], next: 8,
  },
  {
    id: 8, bg: "linear-gradient(180deg, #0a0f1e 0%, #1a2a1a 100%)",
    speaker: "Наклз", speakerColor: "#e63946",
    text: "Хватит болтать. Мастер Изумруд предупреждает меня — тёмная энергия исходит из того командного модуля. Это не просто машина. Эггман нашёл что-то древнее.",
    choices: [
      { text: "⚡ «Тогда уничтожим это»", next: 9, effect: "+Наклз · Начать битву" },
      { text: "🔍 «Надо изучить, что это»", next: 9, effect: "+Тейлз · Особый квест" },
    ], next: 9,
  },
  {
    id: 9, bg: "linear-gradient(180deg, #1a0505 0%, #2a0a0a 100%)",
    speaker: "Эггман", speakerColor: "#ff4444",
    text: "ХА-ХА-ХА! Неужели сам Соник пришёл на мою вечеринку? Мои Эгг-Нокеры уже заряжены. А за мной стоит нечто, что даже ты не сможешь обогнать, сине-пушистый!",
    choices: [
      { text: "💨 «Хочешь — догони»", next: 1, effect: "→ В битву!" },
    ], next: 1,
  },
];

const QUESTS = [
  { id: 1, title: "Первый контакт", type: "Сюжет", status: "active", progress: 60, desc: "Найдите базу Эггмана у Станции Казино и разведайте её.", reward: "500 кругов · +Соник" },
  { id: 2, title: "Сердце машины", type: "Сюжет", status: "available", progress: 0, desc: "Отключите центральный процессор Эгг-Нокера.", reward: "1200 кругов · Турбо-Кольцо" },
  { id: 3, title: "Шоколадная беда", type: "Побочный", status: "available", progress: 0, desc: "Верните украденные кольца жителям Посёлка Роз.", reward: "+Эми · редкий чертёж" },
  { id: 4, title: "Тени прошлого", type: "Отношения", status: "locked", progress: 0, desc: "Узнайте, почему Шэдоу появился здесь один.", reward: "+Шэдоу разблокирован" },
  { id: 5, title: "Рёв стали", type: "Битва", status: "active", progress: 25, desc: "Уничтожьте три танка «Эгг-Крашер» в Промышленной Зоне.", reward: "800 кругов · броня Ехидны" },
];

const INVENTORY_ITEMS = [
  { id: 1, name: "Хаос-Изумруд", type: "Ключевой", rarity: "legendary", emoji: "💎", desc: "Источник невероятной силы. Один из семи." },
  { id: 2, name: "Турбо-Кольцо", type: "Оборудование", rarity: "rare", emoji: "🔵", desc: "+30% к скорости в бою" },
  { id: 3, name: "Чертёж Тейлза", type: "Крафт", rarity: "uncommon", emoji: "📐", desc: "Позволяет улучшить Биплан до версии 2.0" },
  { id: 4, name: "Красный Звёздный Рубин", type: "Ресурс", rarity: "rare", emoji: "❤️‍🔥", desc: "Нужен для квеста Шэдоу" },
  { id: 5, name: "Перехваченный сигнал", type: "Улика", rarity: "common", emoji: "📡", desc: "Данные перехваченного сигнала Эггмана" },
  { id: 6, name: "Броня Ехидны", type: "Оборудование", rarity: "uncommon", emoji: "🛡️", desc: "+20% защиты для Наклза" },
];

const SAVE_SLOTS = [
  { id: 1, name: "Слот 1", chapter: "Глава 2: Стальной Рассвет", time: "3ч 42мин", date: "25.03.2026" },
  { id: 2, name: "Слот 2", chapter: "Глава 1: Первый контакт", time: "1ч 15мин", date: "24.03.2026" },
  { id: 3, name: "Слот 3", chapter: null as null, time: null as null, date: null as null },
];

const INIT_PLAYER = [
  { name: "Биплан Тейлза", hp: 120, maxHp: 120, atk: 35, def: 20, emoji: "✈️" },
  { name: "Мото-Буггер", hp: 90, maxHp: 90, atk: 45, def: 15, emoji: "🏎️" },
];
const INIT_ENEMY = [
  { name: "Эгг-Нокер I", hp: 100, maxHp: 100, atk: 30, def: 25, emoji: "🤖" },
  { name: "Эгг-Нокер II", hp: 80, maxHp: 80, atk: 35, def: 18, emoji: "⚙️" },
];

const RARITY_COLORS: Record<string, string> = {
  legendary: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
  rare: "text-cyan-400 border-cyan-400/30 bg-cyan-400/5",
  uncommon: "text-green-400 border-green-400/30 bg-green-400/5",
  common: "text-gray-400 border-gray-600/40 bg-gray-800/30",
};

export default function Index() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [textDone, setTextDone] = useState(false);
  const [selectedChar, setSelectedChar] = useState<number | null>(null);
  const [galleryTab, setGalleryTab] = useState<"all" | "female" | "scenes">("all");
  const [battleLog, setBattleLog] = useState<string[]>(["⚔️ Битва началась!"]);
  const [playerUnits, setPlayerUnits] = useState(INIT_PLAYER);
  const [enemyUnits, setEnemyUnits] = useState(INIT_ENEMY);
  const [battleTurn, setBattleTurn] = useState<"player" | "enemy">("player");
  const [menuReady, setMenuReady] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const textRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentScene = STORY_SCENES[sceneIndex];

  useEffect(() => {
    const t = setTimeout(() => setMenuReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (screen !== "novel") return;
    setDisplayedText("");
    setTextDone(false);
    let i = 0;
    const txt = currentScene.text;
    if (textRef.current) clearInterval(textRef.current);
    textRef.current = setInterval(() => {
      i++;
      setDisplayedText(txt.slice(0, i));
      if (i >= txt.length) {
        clearInterval(textRef.current!);
        setTextDone(true);
      }
    }, 25);
    return () => { if (textRef.current) clearInterval(textRef.current); };
  }, [sceneIndex, screen]);

  const goToScene = (nextId: number) => {
    const idx = STORY_SCENES.findIndex(s => s.id === nextId);
    setSceneIndex(idx >= 0 ? idx : 0);
  };

  const skipText = () => {
    if (textRef.current) clearInterval(textRef.current);
    setDisplayedText(currentScene.text);
    setTextDone(true);
  };

  const doBattleAction = (unitIdx: number) => {
    if (battleTurn !== "player") return;
    const attacker = playerUnits[unitIdx];
    if (attacker.hp <= 0) return;
    const aliveEnemy = enemyUnits.findIndex(u => u.hp > 0);
    if (aliveEnemy < 0) return;
    const target = enemyUnits[aliveEnemy];
    const dmg = Math.max(5, attacker.atk - target.def + Math.floor(Math.random() * 15));
    const newEnemy = enemyUnits.map((u, i) => i === aliveEnemy ? { ...u, hp: Math.max(0, u.hp - dmg) } : u);
    setEnemyUnits(newEnemy);
    setBattleLog(prev => [`💥 ${attacker.name} → ${target.name}: -${dmg} HP`, ...prev.slice(0, 6)]);
    setBattleTurn("enemy");
    setTimeout(() => {
      const atkEnemy = newEnemy.find(u => u.hp > 0);
      if (atkEnemy) {
        const alivePlayer = playerUnits.findIndex(u => u.hp > 0);
        if (alivePlayer >= 0) {
          const dmg2 = Math.max(5, atkEnemy.atk - playerUnits[alivePlayer].def + Math.floor(Math.random() * 10));
          setPlayerUnits(prev => prev.map((u, i) => i === alivePlayer ? { ...u, hp: Math.max(0, u.hp - dmg2) } : u));
          setBattleLog(prev => [`🤖 ${atkEnemy.name} ↩ -${dmg2} HP`, ...prev.slice(0, 6)]);
        }
      }
      setBattleTurn("player");
    }, 900);
  };

  const NAV: { key: Screen; label: string; icon: string }[] = [
    { key: "menu", label: "Меню", icon: "Home" },
    { key: "novel", label: "История", icon: "BookOpen" },
    { key: "battle", label: "Битва", icon: "Swords" },
    { key: "gallery", label: "Галерея", icon: "Users" },
    { key: "quests", label: "Квесты", icon: "Scroll" },
    { key: "relations", label: "Связи", icon: "Heart" },
    { key: "inventory", label: "Предметы", icon: "Package" },
    { key: "saves", label: "Сохранения", icon: "Save" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white" style={{ fontFamily: "'Rubik', sans-serif" }}>

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0a0f1e]/95 backdrop-blur border-b border-[rgba(0,180,216,0.2)]">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[var(--sonic-gold)] animate-ring-spin inline-block text-base">⭕</span>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--neon-cyan)] hidden sm:block" style={{ fontFamily: "'Orbitron', monospace" }}>
              Mobians und Tanks
            </span>
          </div>
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {NAV.map(item => (
              <button
                key={item.key}
                onClick={() => setScreen(item.key)}
                className={`nav-item text-[10px] px-2 py-1.5 ${screen === item.key ? "active text-[var(--neon-cyan)]" : "text-gray-500 hover:text-gray-200"}`}
              >
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">
                  <Icon name={item.icon as Parameters<typeof Icon>[0]["name"]} size={15} />
                </span>
              </button>
            ))}
          </div>
          <div className="text-[var(--sonic-gold)] text-xs font-bold shrink-0" style={{ fontFamily: "'Orbitron', monospace" }}>
            ⭕ 1,240
          </div>
        </div>
      </nav>

      <div className="pt-12">

        {/* ── MAIN MENU ─────────────────────────── */}
        {screen === "menu" && (
          <div className="relative min-h-[calc(100vh-48px)] flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG_MAIN})` }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/60 via-[#0a0f1e]/20 to-[#0a0f1e]" />
            <div className="scanlines absolute inset-0 z-10" />

            <div className={`relative z-20 text-center px-6 transition-all duration-700 ${menuReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <div className="text-[var(--sonic-gold)] text-xs tracking-[0.5em] uppercase mb-3" style={{ fontFamily: "'Orbitron', monospace" }}>
                ✦ Visual Novel × RPG ✦
              </div>
              <h1
                className="text-5xl md:text-7xl font-black mb-1 animate-title-glow"
                style={{ fontFamily: "'Orbitron', monospace", WebkitTextStroke: "1px rgba(0,245,255,0.4)" }}
              >
                MOBIANS
              </h1>
              <h2
                className="text-3xl md:text-5xl font-black text-[var(--neon-cyan)] mb-1 tracking-wider"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                UND TANKS
              </h2>
              <p className="text-gray-500 tracking-[0.4em] text-xs mb-10">VISUAL NOVEL × RPG · 18+</p>

              <div className="flex flex-col items-center gap-3 mb-10">
                <button onClick={() => setScreen("novel")} className="game-btn-primary w-60 text-sm">
                  ▶ Новая игра
                </button>
                <button onClick={() => setScreen("saves")} className="game-btn-secondary w-60 text-sm">
                  ◈ Загрузить игру
                </button>
                <button onClick={() => setScreen("gallery")} className="game-btn-secondary w-60 text-sm">
                  ◇ Галерея
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
                {[
                  { icon: "BookOpen", label: "Визуальная новелла" },
                  { icon: "Swords", label: "Танковые битвы" },
                  { icon: "Heart", label: "Система отношений" },
                  { icon: "GitBranch", label: "Ветвящийся сюжет" },
                ].map(f => (
                  <div key={f.label} className="neon-border rounded-lg p-3 bg-black/40 text-center">
                    <Icon name={f.icon as Parameters<typeof Icon>[0]["name"]} size={18} className="mx-auto mb-1 text-[var(--neon-cyan)]" />
                    <p className="text-[10px] text-gray-400">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── VISUAL NOVEL ─────────────────────── */}
        {screen === "novel" && (
          <div className="min-h-[calc(100vh-48px)] flex flex-col justify-end relative" style={{ background: currentScene.bg }}>
            <div className="absolute inset-0 star-field opacity-25 pointer-events-none" />

            {/* Персонаж-фон */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-48">
              <div className="text-[14rem] opacity-15 animate-float leading-none select-none">
                {currentScene.speaker === "Соник" ? "🦔" :
                 currentScene.speaker === "Тейлз" ? "🦊" :
                 currentScene.speaker === "Шэдоу" ? "🖤" :
                 currentScene.speaker === "Эми" ? "🌸" :
                 currentScene.speaker === "Наклз" ? "👊" :
                 currentScene.speaker === "Руж" ? "🦇" :
                 currentScene.speaker === "Эггман" ? "🥚" : "🌌"}
              </div>
            </div>

            <div className="absolute top-3 left-3 text-[10px] text-[var(--sonic-gold)] tracking-[0.2em] uppercase" style={{ fontFamily: "'Orbitron', monospace" }}>
              Глава 1 · Сцена {sceneIndex + 1}/{STORY_SCENES.length}
            </div>

            {/* 18+ метка для Эми и Руж */}
            {(currentScene.speaker === "Эми" || currentScene.speaker === "Руж") && (
              <div className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded border border-pink-500/50 text-pink-400 bg-pink-500/10" style={{ fontFamily: "'Orbitron', monospace" }}>
                18+
              </div>
            )}

            <div className="relative z-10 p-4 pb-6">
              <div className="dialogue-box rounded-2xl p-5 mb-3" onClick={!textDone ? skipText : undefined} style={{ cursor: !textDone ? "pointer" : "default" }}>
                <div className="flex items-center gap-3 mb-3">
                  {/* Портрет */}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `${currentScene.speakerColor}20`, border: `1px solid ${currentScene.speakerColor}50` }}>
                    {currentScene.speaker === "Соник" ? "🦔" :
                     currentScene.speaker === "Тейлз" ? "🦊" :
                     currentScene.speaker === "Шэдоу" ? "🖤" :
                     currentScene.speaker === "Эми" ? "🌸" :
                     currentScene.speaker === "Наклз" ? "👊" :
                     currentScene.speaker === "Руж" ? "🦇" :
                     currentScene.speaker === "Эггман" ? "🥚" : "📖"}
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-widest uppercase" style={{ color: currentScene.speakerColor, fontFamily: "'Orbitron', monospace" }}>
                      {currentScene.speaker}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {currentScene.speaker === "Соник" ? "Освободительный фронт" :
                       currentScene.speaker === "Тейлз" ? "Механик · Пилот" :
                       currentScene.speaker === "Шэдоу" ? "Классификация неизвестна" :
                       currentScene.speaker === "Эми" ? "Боец · 18+" :
                       currentScene.speaker === "Наклз" ? "Страж Изумруда" :
                       currentScene.speaker === "Руж" ? "Агент G.U.N. · 18+" :
                       currentScene.speaker === "Эггман" ? "Dr. Ivo Robotnik" : ""}
                    </div>
                  </div>
                  {!textDone && <span className="ml-auto text-[10px] text-gray-600">нажмите для пропуска</span>}
                </div>
                <p className="text-gray-100 leading-relaxed text-sm">
                  {displayedText}
                  {!textDone && <span className="animate-cursor inline-block w-[2px] h-4 bg-[var(--neon-cyan)] ml-0.5 align-middle" />}
                </p>
              </div>

              {textDone && currentScene.choices.length > 0 && (
                <div className="flex flex-col gap-2 animate-slide-up">
                  {currentScene.choices.map((c, i) => (
                    <button key={i} className="choice-btn rounded-xl px-4 py-3 text-left" onClick={() => goToScene(c.next)}>
                      <div className="text-sm text-white">{c.text}</div>
                      <div className="text-[10px] text-[var(--sonic-gold)] mt-0.5">{c.effect}</div>
                    </button>
                  ))}
                </div>
              )}
              {textDone && currentScene.choices.length === 0 && (
                <button className="w-full choice-btn rounded-xl py-3 text-center text-sm text-[var(--neon-cyan)] animate-slide-up" onClick={() => goToScene(currentScene.next!)}>
                  Продолжить ›
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── BATTLE ───────────────────────────── */}
        {screen === "battle" && (
          <div className="min-h-[calc(100vh-48px)] p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${IMG_BATTLE})` }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/90 to-[#0a0f1e]" />
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-lg font-black text-center mb-0.5 text-[var(--neon-cyan)]" style={{ fontFamily: "'Orbitron', monospace" }}>⚔️ Танковая Битва</h2>
              <p className="text-center text-[10px] text-gray-500 mb-4">Промышленная Зона · Волна 1/3</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-[10px] text-[var(--sonic-gold)] mb-2 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', monospace" }}>🛡 Союзники</div>
                  {playerUnits.map((unit, i) => (
                    <div
                      key={i}
                      className={`panel rounded-xl p-3 mb-2 transition-all ${battleTurn === "player" && unit.hp > 0 ? "neon-border cursor-pointer hover:-translate-y-1" : "opacity-60"} ${unit.hp <= 0 ? "opacity-20" : ""}`}
                      onClick={() => doBattleAction(i)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{unit.emoji}</span>
                        <div>
                          <div className="text-[11px] font-bold">{unit.name}</div>
                          <div className="text-[10px] text-gray-400">⚔️{unit.atk} 🛡{unit.def}</div>
                        </div>
                      </div>
                      <div className="hp-bar"><div className="hp-fill" style={{ width: `${(unit.hp / unit.maxHp) * 100}%` }} /></div>
                      <div className="text-[10px] text-gray-500 mt-1">{unit.hp}/{unit.maxHp} HP</div>
                      {battleTurn === "player" && unit.hp > 0 && <div className="text-[10px] text-[var(--neon-cyan)] mt-1">▸ Нажмите для атаки</div>}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] text-[var(--sonic-red)] mb-2 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', monospace" }}>💀 Враги</div>
                  {enemyUnits.map((unit, i) => (
                    <div key={i} className={`panel rounded-xl p-3 mb-2 ${unit.hp <= 0 ? "opacity-20" : ""}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{unit.emoji}</span>
                        <div>
                          <div className="text-[11px] font-bold">{unit.name}</div>
                          <div className="text-[10px] text-gray-400">⚔️{unit.atk} 🛡{unit.def}</div>
                        </div>
                      </div>
                      <div className="hp-bar">
                        <div className="hp-fill" style={{ width: `${(unit.hp / unit.maxHp) * 100}%`, background: "linear-gradient(90deg,#e63946,#ff6b6b)", boxShadow: "0 0 8px rgba(230,57,70,0.5)" }} />
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">{unit.hp}/{unit.maxHp} HP</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel rounded-xl p-3 mb-3">
                <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', monospace" }}>
                  {battleTurn === "player" ? "🎯 Выберите юнит — нажмите на него выше" : "⏳ Ответный удар..."}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="battle-btn bg-[var(--sonic-blue)] text-[#0a0f1e] text-[11px] py-2 disabled:opacity-30" disabled={battleTurn !== "player"} onClick={() => doBattleAction(0)}>
                    ⚡ Атака — {playerUnits[0].name}
                  </button>
                  <button className="battle-btn bg-[var(--sonic-gold)] text-[#0a0f1e] text-[11px] py-2 disabled:opacity-30" disabled={battleTurn !== "player"} onClick={() => doBattleAction(1)}>
                    ✈️ Атака — {playerUnits[1].name}
                  </button>
                </div>
              </div>

              <div className="panel rounded-xl p-3">
                <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', monospace" }}>Лог битвы</div>
                {battleLog.map((log, i) => (
                  <div key={i} className={`text-[11px] py-0.5 ${i === 0 ? "text-white" : "text-gray-600"}`}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── GALLERY ──────────────────────────── */}
        {screen === "gallery" && (
          <div className="min-h-[calc(100vh-48px)] p-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-black text-center mb-0.5 text-[var(--neon-cyan)]" style={{ fontFamily: "'Orbitron', monospace" }}>Галерея</h2>
              <p className="text-center text-[10px] text-gray-500 mb-4">Персонажи и арты Мобиуса</p>

              {/* Вкладки */}
              <div className="flex gap-2 mb-5 p-1 rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(0,180,216,0.15)]">
                {([["all","Все"], ["female","💋 Для взрослых"], ["scenes","Сцены"]] as const).map(([key, label]) => (
                  <button key={key} onClick={() => setGalleryTab(key)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${galleryTab === key ? "bg-[var(--neon-cyan)] text-[#0a0f1e]" : "text-gray-400 hover:text-white"}`}
                    style={{ fontFamily: "'Orbitron', monospace" }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Вкладка: все персонажи */}
              {galleryTab === "all" && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CHARACTERS.map(char => (
                    <div key={char.id} className="char-card rounded-xl p-4 cursor-pointer relative" onClick={() => setSelectedChar(selectedChar === char.id ? null : char.id)}>
                      {char.isAdult && (
                        <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded border border-pink-500/50 text-pink-400 bg-pink-500/10" style={{ fontFamily: "'Orbitron', monospace" }}>18+</span>
                      )}
                      <div className="text-4xl text-center mb-2">{char.portrait}</div>
                      <div className="text-center">
                        <div className="font-bold text-sm">{char.name}</div>
                        <div className="text-[10px] text-gray-400 mb-1">{char.role}</div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${char.color}20`, color: char.color, border: `1px solid ${char.color}40` }}>
                          {char.faction}
                        </span>
                      </div>
                      {selectedChar === char.id && (
                        <div className="mt-3 pt-3 border-t border-gray-700 animate-fade-in">
                          <p className="text-[11px] text-gray-300">{char.desc}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {char.isAdult && <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400">18+ контент</span>}
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]">
                              ♥ {char.relation}/100
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Вкладка: взрослый контент */}
              {galleryTab === "female" && (
                <div>
                  <div className="mb-4 panel rounded-xl p-3 border border-pink-500/20 text-center">
                    <p className="text-[11px] text-pink-300">Контент только для взрослых 18+. Открывается по мере развития отношений с персонажами.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CHARACTERS.filter(c => c.isAdult).map(char => (
                      <div key={char.id} className="rounded-2xl overflow-hidden relative cursor-pointer group"
                        style={{ background: `linear-gradient(135deg, ${char.color}15 0%, #0a0f1e 100%)`, border: `1px solid ${char.color}40` }}
                        onClick={() => setSelectedChar(selectedChar === char.id ? null : char.id)}>
                        {/* Арт-заглушка */}
                        <div className="relative aspect-[3/4] flex flex-col items-center justify-center overflow-hidden">
                          <div className="text-[8rem] opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500 select-none">
                            {char.portrait}
                          </div>
                          {/* Частицы */}
                          <div className="absolute inset-0 pointer-events-none" style={{
                            backgroundImage: `radial-gradient(circle at 30% 40%, ${char.color}20 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${char.color}15 0%, transparent 50%)`
                          }} />
                          {/* Лок если отношения низкие */}
                          {char.relation < 70 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                              <div className="text-4xl mb-2">🔒</div>
                              <p className="text-xs text-gray-300 text-center px-4" style={{ fontFamily: "'Orbitron', monospace" }}>
                                Требуется {70 - char.relation} ед. отношений
                              </p>
                              <div className="mt-2 hp-bar w-32">
                                <div className="hp-fill" style={{ width: `${char.relation}%`, background: `linear-gradient(90deg, ${char.color}, ${char.color}aa)` }} />
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1">{char.relation}/70 для разблокировки</p>
                            </div>
                          ) : (
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
                              <div className="text-[10px] text-pink-300 mb-1" style={{ fontFamily: "'Orbitron', monospace" }}>✦ РАЗБЛОКИРОВАНО</div>
                              <p className="text-xs text-gray-200 italic leading-relaxed">
                                {char.name === "Эми" && "«Ты думал, я просто с молотом хожу? Я умею быть и... другой. Если заслужишь~»"}
                                {char.name === "Руж" && "«Разведчики всегда знают, чем взять противника. Хочешь узнать мой метод... лично?»"}
                                {char.name === "Салли" && "«Принцесса умеет отдавать приказы. Но иногда... хочется подчиниться. Только для тебя.»"}
                                {char.name === "Блейз" && "«Я контролирую огонь. Но с тобой рядом... контроль даётся сложнее, чем обычно.»"}
                                {char.name === "Волнушка" && "«На пиратских кораблях нет правил. Особенно — ночью в доках. Ты ведь не против...?»"}
                              </p>
                            </div>
                          )}
                        </div>
                        {/* Инфо */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-base" style={{ color: char.color, fontFamily: "'Orbitron', monospace" }}>{char.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-pink-500/40 text-pink-400 bg-pink-500/10">18+</span>
                          </div>
                          <p className="text-[11px] text-gray-400">{char.role}</p>
                          <div className="mt-2 hp-bar">
                            <div className="hp-fill" style={{ width: `${char.relation}%`, background: `linear-gradient(90deg, ${char.color}, ${char.color}88)`, boxShadow: `0 0 8px ${char.color}66` }} />
                          </div>
                          <p className="text-[10px] text-gray-600 mt-0.5">Отношения: {char.relation}/100</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Вкладка: сцены */}
              {galleryTab === "scenes" && (
                <div className="grid grid-cols-2 gap-3">
                  {[{ src: BG_MAIN, label: "Зелёные Холмы", tag: "Сюжет" }, { src: IMG_BATTLE, label: "Промышленная Зона", tag: "Битва" }].map(s => (
                    <div key={s.label} className="rounded-xl overflow-hidden neon-border aspect-video relative group cursor-pointer">
                      <img src={s.src} alt={s.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-3">
                        <div className="text-[10px] text-[var(--sonic-gold)] mb-0.5">{s.tag}</div>
                        <p className="text-xs font-bold">{s.label}</p>
                      </div>
                    </div>
                  ))}
                  {/* Locked scenes */}
                  {["Станция Казино", "Остров Ангела", "Башня Эггмана", "Архив G.U.N."].map(name => (
                    <div key={name} className="rounded-xl aspect-video relative flex flex-col items-center justify-center bg-[rgba(0,0,0,0.5)] border border-gray-800">
                      <Icon name="Lock" size={20} className="text-gray-600 mb-1" />
                      <p className="text-[10px] text-gray-600">{name}</p>
                      <p className="text-[9px] text-gray-700">Разблокировать в сюжете</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── QUESTS ───────────────────────────── */}
        {screen === "quests" && (
          <div className="min-h-[calc(100vh-48px)] p-4">
            <div className="max-w-xl mx-auto">
              <h2 className="text-lg font-black text-center mb-0.5 text-[var(--neon-cyan)]" style={{ fontFamily: "'Orbitron', monospace" }}>Квесты</h2>
              <p className="text-center text-[10px] text-gray-500 mb-5">Журнал заданий</p>
              <div className="space-y-3">
                {QUESTS.map(q => (
                  <div key={q.id} className={`panel rounded-xl p-4 border-l-4 transition-all ${q.status === "locked" ? "opacity-50" : ""}`}
                    style={{ borderLeftColor: q.status === "active" ? "var(--sonic-gold)" : q.status === "available" ? "var(--sonic-blue)" : "#333" }}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{q.type === "Сюжет" ? "📖" : q.type === "Битва" ? "⚔️" : q.type === "Отношения" ? "💕" : "🎯"}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-bold">{q.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${q.status === "active" ? "bg-yellow-400/20 text-yellow-400" : q.status === "available" ? "bg-cyan-400/20 text-cyan-400" : "bg-gray-700 text-gray-500"}`}>
                            {q.status === "active" ? "Активен" : q.status === "available" ? "Доступен" : "🔒 Заперт"}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mb-2">{q.desc}</p>
                        {q.progress > 0 && <div className="hp-bar mb-1"><div className="hp-fill" style={{ width: `${q.progress}%` }} /></div>}
                        <div className="text-[11px] text-[var(--sonic-gold)]">🏆 {q.reward}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RELATIONS ────────────────────────── */}
        {screen === "relations" && (
          <div className="min-h-[calc(100vh-48px)] p-4">
            <div className="max-w-xl mx-auto">
              <h2 className="text-lg font-black text-center mb-0.5 text-[var(--neon-cyan)]" style={{ fontFamily: "'Orbitron', monospace" }}>Отношения</h2>
              <p className="text-center text-[10px] text-gray-500 mb-5">Влияет на сюжет и концовки</p>
              <div className="space-y-3">
                {CHARACTERS.map(char => (
                  <div key={char.id} className="panel rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{char.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-sm">{char.name}</span>
                          <span className="text-sm font-bold" style={{ color: char.relation >= 70 ? "#2dc653" : char.relation >= 40 ? "#ffd60a" : "#e63946" }}>
                            {char.relation}/100
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 mb-2">{char.role} · {char.faction}</div>
                        <div className="hp-bar">
                          <div className="hp-fill" style={{
                            width: `${char.relation}%`,
                            background: char.relation >= 70 ? "linear-gradient(90deg,#2dc653,#5dfc8b)" : char.relation >= 40 ? "linear-gradient(90deg,#ffd60a,#ffee55)" : "linear-gradient(90deg,#e63946,#ff6b6b)",
                            boxShadow: `0 0 8px ${char.relation >= 70 ? "rgba(45,198,83,0.4)" : char.relation >= 40 ? "rgba(255,214,10,0.4)" : "rgba(230,57,70,0.4)"}`
                          }} />
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {char.relation >= 80 ? "💕 Союзник" : char.relation >= 60 ? "🤝 Дружба" : char.relation >= 40 ? "😐 Нейтрал" : "⚠️ Напряжённо"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 panel rounded-xl p-4 border border-yellow-400/10">
                <div className="text-[10px] text-[var(--sonic-gold)] mb-1 uppercase tracking-widest" style={{ fontFamily: "'Orbitron', monospace" }}>💡 Как это работает</div>
                <p className="text-[11px] text-gray-400">Выборы в диалогах меняют отношения. Высокие отношения открывают квесты, уникальные сцены и концовки. Некоторых персонажей можно завербовать только при уровне 70+.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── INVENTORY ────────────────────────── */}
        {screen === "inventory" && (
          <div className="min-h-[calc(100vh-48px)] p-4">
            <div className="max-w-xl mx-auto">
              <h2 className="text-lg font-black text-center mb-0.5 text-[var(--neon-cyan)]" style={{ fontFamily: "'Orbitron', monospace" }}>Инвентарь</h2>
              <p className="text-center text-[10px] text-gray-500 mb-5">Предметы и оборудование</p>
              <div className="grid grid-cols-2 gap-3">
                {INVENTORY_ITEMS.map(item => (
                  <div key={item.id} className={`rounded-xl p-4 border cursor-pointer transition-all hover:-translate-y-1 ${RARITY_COLORS[item.rarity]}`}
                    onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}>
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="text-sm font-bold text-white mb-0.5">{item.name}</div>
                    <div className="text-[10px] text-gray-400 mb-2">{item.desc}</div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${RARITY_COLORS[item.rarity]}`}>{item.type}</span>
                      <span className="text-[10px]" style={{ color: item.rarity === "legendary" ? "#ffd60a" : item.rarity === "rare" ? "#00b4d8" : item.rarity === "uncommon" ? "#2dc653" : "#666" }}>
                        {item.rarity === "legendary" ? "✨" : item.rarity === "rare" ? "◆" : item.rarity === "uncommon" ? "◇" : "·"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SAVES ────────────────────────────── */}
        {screen === "saves" && (
          <div className="min-h-[calc(100vh-48px)] p-4">
            <div className="max-w-xl mx-auto">
              <h2 className="text-lg font-black text-center mb-0.5 text-[var(--neon-cyan)]" style={{ fontFamily: "'Orbitron', monospace" }}>Сохранения</h2>
              <p className="text-center text-[10px] text-gray-500 mb-5">Управление прогрессом</p>
              <div className="space-y-3">
                {SAVE_SLOTS.map(slot => (
                  <div key={slot.id} className="panel rounded-xl p-5 neon-border">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-black text-sm mb-1" style={{ fontFamily: "'Orbitron', monospace" }}>{slot.name}</div>
                        {slot.chapter ? (
                          <>
                            <div className="text-sm text-gray-300">{slot.chapter}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">⏱ {slot.time} · 📅 {slot.date}</div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-600 italic">— Пусто —</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        {slot.chapter && (
                          <button className="game-btn-primary text-[11px] px-3 py-1.5" onClick={() => setScreen("novel")}>Загрузить</button>
                        )}
                        <button className="game-btn-secondary text-[11px] px-3 py-1.5">
                          {slot.chapter ? "Перезапись" : "Сохранить"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 panel rounded-xl p-3 text-center">
                <div className="text-[10px] text-gray-500">Автосохранение ✅ · Каждый диалог</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}