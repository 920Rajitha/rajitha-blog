"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function findRequirementNumber(text, patterns) {
  for (const pattern of patterns) {
    const match = (text || "").match(pattern);
    if (match) return Number(match[1]);
  }
  return null;
}

function StatusBadge({ status }) {
  const config = {
    pass: {
      label: "Meets minimum",
      className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
      icon: "✓",
    },
    fail: {
      label: "Below minimum",
      className: "border-red-400/25 bg-red-400/10 text-red-300",
      icon: "!",
    },
    unknown: {
      label: "Manual check",
      className: "border-amber-400/25 bg-amber-400/10 text-amber-200",
      icon: "?",
    },
  };

  const item = config[status] || config.unknown;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${item.className}`}>
      <span aria-hidden="true">{item.icon}</span>
      {item.label}
    </span>
  );
}

function SectionHeading({ number, eyebrow, title, description }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-400/10 text-xs font-bold text-blue-300">
          {number}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-lg font-bold tracking-tight text-white md:text-xl">{title}</h2>
      <p className="mt-1.5 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function RequirementCard({ title, text, tone }) {
  return (
    <div className="group rounded-2xl border border-white/[0.09] bg-slate-950/45 p-4 transition duration-300 hover:border-blue-400/25 hover:bg-slate-950/65">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <span className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
          tone === "recommended"
            ? "bg-violet-400/10 text-violet-300"
            : "bg-blue-400/10 text-blue-300"
        }`}>
          {tone === "recommended" ? "Recommended" : "Minimum"}
        </span>
      </div>
      <pre className="whitespace-pre-wrap break-words font-sans text-[13px] leading-6 text-slate-300">
        {text || "Not provided by Steam for this game."}
      </pre>
    </div>
  );
}

export default function GameCheckerPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [pc, setPc] = useState({
    cpu: "",
    gpu: "",
    ram: "16",
    storage: "100",
  });
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectingId, setSelectingId] = useState(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const minimumRam = useMemo(
    () =>
      requirements
        ? findRequirementNumber(requirements.minimum, [
            /(?:memory|ram)[^\d]{0,30}(\d+(?:\.\d+)?)\s*gb/i,
            /(\d+(?:\.\d+)?)\s*gb[^\n]{0,30}(?:ram|memory)/i,
          ])
        : null,
    [requirements]
  );

  const minimumStorage = useMemo(
    () =>
      requirements
        ? findRequirementNumber(requirements.minimum, [
            /(?:storage|available space|hard drive|disk space)[^\d]{0,30}(\d+(?:\.\d+)?)\s*gb/i,
            /(\d+(?:\.\d+)?)\s*gb[^\n]{0,30}(?:storage|available space|hard drive|disk space)/i,
          ])
        : null,
    [requirements]
  );

  async function searchGames(event, searchTerm = query) {
    if (event) event.preventDefault();

    const term = searchTerm.trim();
    if (term.length < 2) {
      setError("Please enter at least 2 characters to search.");
      return;
    }

    setQuery(term);
    setLoadingSearch(true);
    setError("");
    setSearched(true);
    setResults([]);
    setSelectedGame(null);
    setRequirements(null);

    try {
      const response = await fetch(
        `/api/game-checker/search?q=${encodeURIComponent(term)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Game search failed. Please try again.");
      }

      const games = Array.isArray(data.results) ? data.results : [];
      setResults(games);

      if (!games.length) {
        setError("No matching Steam games found. Try a different game title.");
      }
    } catch (err) {
      setError(err.message || "Unable to search games right now.");
    } finally {
      setLoadingSearch(false);
    }
  }

  async function chooseGame(game) {
    setSelectedGame(game);
    setRequirements(null);
    setError("");
    setSelectingId(game.id);
    setLoadingDetails(true);

    try {
      const response = await fetch(
        `/api/game-checker/details?id=${encodeURIComponent(game.id)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load game requirements.");
      }

      setRequirements(data);
    } catch (err) {
      setError(err.message || "Unable to load requirements.");
    } finally {
      setLoadingDetails(false);
      setSelectingId(null);
    }
  }

  function updatePc(field, value) {
    setPc((current) => ({ ...current, [field]: value }));
  }

  const ramValue = Number(pc.ram);
  const storageValue = Number(pc.storage);
  const hasValidPc =
    pc.ram !== "" &&
    pc.storage !== "" &&
    Number.isFinite(ramValue) &&
    ramValue >= 0 &&
    Number.isFinite(storageValue) &&
    storageValue >= 0;

  const ramStatus =
    minimumRam === null ? "unknown" : ramValue >= minimumRam ? "pass" : "fail";
  const storageStatus =
    minimumStorage === null
      ? "unknown"
      : storageValue >= minimumStorage
        ? "pass"
        : "fail";

  const minKnown = minimumRam !== null || minimumStorage !== null;
  const minFail = ramStatus === "fail" || storageStatus === "fail";
  const checksKnown =
    (minimumRam !== null && ramStatus !== "unknown") ||
    (minimumStorage !== null && storageStatus !== "unknown");

  const overallStatus = !hasValidPc || !checksKnown
    ? "unknown"
    : minFail
      ? "fail"
      : "pass";

  const popularGames = [
    "Black Myth: Wukong",
    "Cyberpunk 2077",
    "Grand Theft Auto V",
    "Elden Ring",
  ];

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#080e1d] px-4 py-8 text-slate-200 sm:px-6 md:px-8 md:py-12">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(148,163,184,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.5)_1px,transparent_1px)] [background-size:42px_42px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[440px] w-[680px] -translate-x-1/2 rounded-full bg-blue-600/[0.12] blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-150px] top-[480px] h-[360px] w-[360px] rounded-full bg-violet-600/[0.08] blur-[130px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Back navigation */}
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-blue-400/30 hover:bg-blue-400/[0.06] hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Back to Rajitha Blog
        </Link>

        {/* Page hero */}
        <header className="relative mb-8 overflow-hidden rounded-3xl border border-blue-300/15 bg-gradient-to-br from-[#142342] via-[#101a31] to-[#11152b] px-5 py-8 shadow-[0_20px_70px_rgba(2,6,23,.4)] sm:px-8 md:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-cyan-400/[0.09] blur-3xl"
          />
          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.9)]" />
              Free PC gaming tool
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Can Your PC{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Run This Game?
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Find a game, check its published system requirements, and compare
              them with your PC specifications before you install or buy.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-medium text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">🎮 Steam game search</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">⚙️ PC specifications</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">✓ Quick comparison</span>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-65px] right-8 hidden select-none text-[190px] opacity-[0.07] md:block"
          >
            🎮
          </div>
        </header>

        {/* Main input panels */}
        <section className="grid items-start gap-5 lg:grid-cols-2">
          {/* Game search */}
          <div className="rounded-3xl border border-white/10 bg-[#101a30]/90 p-5 shadow-xl backdrop-blur sm:p-6">
            <SectionHeading
              number="01"
              eyebrow="Game library"
              title="Find your game"
              description="Search for a title available on the Steam Store."
            />

            <form onSubmit={searchGames} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500">
                  ⌕
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search a game, e.g. Black Myth: Wukong"
                  aria-label="Search game title"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#080f20] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
              <button
                type="submit"
                disabled={loadingSearch}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-300/20 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingSearch ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Searching
                  </>
                ) : (
                  <>Search games <span aria-hidden="true">→</span></>
                )}
              </button>
            </form>

            <div className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Try a popular title
              </p>
              <div className="flex flex-wrap gap-2">
                {popularGames.map((game) => (
                  <button
                    key={game}
                    type="button"
                    onClick={() => searchGames(null, game)}
                    disabled={loadingSearch}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-400 transition hover:border-blue-400/30 hover:bg-blue-400/10 hover:text-blue-200 disabled:opacity-50"
                  >
                    {game}
                  </button>
                ))}
              </div>
            </div>

            {/* Search feedback */}
            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3 text-sm leading-6 text-red-200"
              >
                <span aria-hidden="true">!</span>
                <span>{error}</span>
              </div>
            )}

            {loadingSearch && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-blue-400/15 bg-blue-400/[0.05] p-4 text-sm text-blue-200">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200/30 border-t-blue-200" />
                Searching Steam for matching games...
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Search results
                  </p>
                  <span className="text-[11px] text-slate-500">
                    {results.length} {results.length === 1 ? "match" : "matches"}
                  </span>
                </div>
                <div className="grid gap-2">
                  {results.map((game) => {
                    const active = selectedGame?.id === game.id;
                    return (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => chooseGame(game)}
                        disabled={loadingDetails}
                        className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition duration-200 disabled:cursor-wait ${
                          active
                            ? "border-blue-400/50 bg-blue-500/[0.10]"
                            : "border-white/[0.08] bg-[#080f20]/70 hover:border-blue-400/30 hover:bg-white/[0.04]"
                        }`}
                      >
                        {game.image ? (
                          <img
                            src={game.image}
                            alt=""
                            loading="lazy"
                            className="h-12 w-[76px] shrink-0 rounded-lg border border-white/10 object-cover"
                          />
                        ) : (
                          <span className="flex h-12 w-[76px] shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xl">
                            🎮
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-100">
                            {game.name}
                          </span>
                          <span className="mt-1 block text-[10px] text-slate-500">
                            Steam app · {game.id}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-blue-300 transition group-hover:translate-x-0.5">
                          {selectingId === game.id ? "Loading…" : active ? "Selected ✓" : "Select →"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {searched && !loadingSearch && results.length === 0 && !error && (
              <p className="mt-5 text-sm text-slate-400">No matching games found. Try another title.</p>
            )}
          </div>

          {/* PC specs */}
          <div className="rounded-3xl border border-white/10 bg-[#101a30]/90 p-5 shadow-xl backdrop-blur sm:p-6">
            <SectionHeading
              number="02"
              eyebrow="Your hardware"
              title="Enter your PC specs"
              description="Add your computer hardware details to compare with the selected game."
            />

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <span className="text-blue-300">▰</span> Processor (CPU)
                </span>
                <input
                  type="text"
                  value={pc.cpu}
                  onChange={(event) => updatePc("cpu", event.target.value)}
                  placeholder="e.g. Intel Core i5-13420H"
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#080f20] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <span className="text-violet-300">▰</span> Graphics card (GPU)
                </span>
                <input
                  type="text"
                  value={pc.gpu}
                  onChange={(event) => updatePc("gpu", event.target.value)}
                  placeholder="e.g. NVIDIA GeForce RTX 3050"
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#080f20] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <span className="text-cyan-300">▦</span> Installed RAM
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={pc.ram}
                      onChange={(event) => updatePc("ram", event.target.value)}
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#080f20] px-4 pr-14 text-sm text-white outline-none transition focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">GB</span>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <span className="text-cyan-300">▤</span> Free storage
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={pc.storage}
                      onChange={(event) => updatePc("storage", event.target.value)}
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#080f20] px-4 pr-14 text-sm text-white outline-none transition focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">GB</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3.5">
              <p className="text-xs font-semibold text-cyan-200">💡 Where can I find my PC specs?</p>
              <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
                CPU and RAM: Windows Settings → System → About. GPU: Task Manager → Performance → GPU. Free storage: This PC.
              </p>
            </div>
          </div>
        </section>

        {/* Selected game and results */}
        {selectedGame && (
          <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#101a30]/95 shadow-xl">
            <div className="border-b border-white/[0.08] bg-gradient-to-r from-blue-500/[0.10] to-violet-500/[0.07] p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    Selected game
                  </div>
                  <h2 className="break-words text-2xl font-black text-white sm:text-3xl">
                    {selectedGame.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">System requirements and PC compatibility overview</p>
                </div>
                {requirements?.steamUrl && (
                  <a
                    href={requirements.steamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-blue-200 transition hover:border-blue-300/30 hover:bg-blue-400/10"
                  >
                    View on Steam ↗
                  </a>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {loadingDetails ? (
                <div className="flex items-center gap-3 py-8 text-sm text-slate-300">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300/20 border-t-blue-300" />
                  Loading published system requirements...
                </div>
              ) : requirements ? (
                <>
                  {!requirements.hasRequirements && (
                    <div className="mb-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-200">
                      Steam has not published PC requirements for this title. You can still review the game page, but an automatic requirements comparison is not available.
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <RequirementCard
                      title="Minimum system requirements"
                      text={requirements.minimum}
                      tone="minimum"
                    />
                    <RequirementCard
                      title="Recommended system requirements"
                      text={requirements.recommended}
                      tone="recommended"
                    />
                  </div>

                  {/* Compatibility summary */}
                  <div className="mt-5 rounded-2xl border border-blue-300/15 bg-gradient-to-br from-blue-500/[0.08] to-indigo-500/[0.04] p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
                          Compatibility snapshot
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-white">Your PC vs this game</h3>
                      </div>
                      <StatusBadge status={overallStatus} />
                    </div>

                    {!hasValidPc ? (
                      <p className="mt-4 text-sm text-amber-200">
                        Enter valid RAM and free storage values to view the automatic capacity check.
                      </p>
                    ) : (
                      <>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-white/[0.08] bg-[#080f20]/75 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-slate-200">RAM</span>
                              <StatusBadge status={ramStatus} />
                            </div>
                            <p className="mt-3 text-xs text-slate-400">
                              Your PC: <strong className="text-white">{ramValue} GB</strong>
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Game minimum: <strong className="text-white">{minimumRam === null ? "Not detected" : `${minimumRam} GB`}</strong>
                            </p>
                          </div>
                          <div className="rounded-xl border border-white/[0.08] bg-[#080f20]/75 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-slate-200">Free storage</span>
                              <StatusBadge status={storageStatus} />
                            </div>
                            <p className="mt-3 text-xs text-slate-400">
                              Your PC: <strong className="text-white">{storageValue} GB</strong>
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Game minimum: <strong className="text-white">{minimumStorage === null ? "Not detected" : `${minimumStorage} GB`}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#080f20]/55 p-4">
                          <p className="text-sm leading-6 text-slate-300">
                            {minFail
                              ? "Your PC is below at least one detected minimum capacity requirement. Review the requirement details and check your CPU and GPU as well."
                              : minKnown
                                ? "Your PC meets the detected RAM and storage minimums. CPU and GPU still need a manual comparison."
                                : "Steam's requirement text did not contain clearly detectable RAM or storage values. Please review the published requirements manually."}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/[0.08] bg-[#080f20]/55 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Your processor</p>
                        <p className="mt-2 break-words text-sm font-semibold text-slate-200">{pc.cpu.trim() || "Not entered"}</p>
                        <p className="mt-2 text-[11px] leading-5 text-amber-200/80">Compare this model with the CPU listed above.</p>
                      </div>
                      <div className="rounded-xl border border-white/[0.08] bg-[#080f20]/55 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Your graphics card</p>
                        <p className="mt-2 break-words text-sm font-semibold text-slate-200">{pc.gpu.trim() || "Not entered"}</p>
                        <p className="mt-2 text-[11px] leading-5 text-amber-200/80">Compare this model with the GPU listed above.</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </section>
        )}

        {/* Footer note */}
        <footer className="mt-8 border-t border-white/[0.07] pt-5 text-center">
          <p className="text-[11px] leading-6 text-slate-500">
            Game information is retrieved from Steam Store data. Requirements may be missing or formatted differently for some games.
            This tool provides a basic comparison, not a guaranteed FPS or performance prediction.
          </p>
          <p className="mt-2 text-[10px] text-slate-600">
            Built for gamers · Rajitha Blog
          </p>
        </footer>
      </div>
    </main>
  );
}
