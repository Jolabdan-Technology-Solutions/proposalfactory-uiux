import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, FileText } from "lucide-react";
import { getVideo, type ButlerVideoAsset } from "@/lib/videos";

const SOUND_KEY = "tpf.butler.sound";

/**
 * Single player used for every butler placement.
 * Give it a video id from the library — the media, title, caption, transcript
 * and version all come from that one entry, so replacing an asset never
 * requires touching a page.
 *
 * Never autoplays. Sound is off until the user asks for it, and that choice
 * is remembered for the session.
 */
export function ButlerVideo({
  id,
  video,
  compact = false,
  showMeta = true,
}: {
  id?: string;
  video?: ButlerVideoAsset;
  compact?: boolean;
  showMeta?: boolean;
}) {
  const asset = video ?? (id ? getVideo(id) : undefined);
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [seen, setSeen] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !asset) return;
    if (window.sessionStorage.getItem(SOUND_KEY) === "on") setMuted(false);
    if (window.sessionStorage.getItem(`tpf.seen.${asset.id}`) === "yes") setSeen(true);
  }, [asset]);

  if (!asset) return null;

  function remember(key: string, value: string) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    remember(SOUND_KEY, next ? "off" : "on");
    if (ref.current) ref.current.muted = next;
  }

  function togglePlay(withSound = false) {
    const el = ref.current;
    if (withSound) {
      setMuted(false);
      remember(SOUND_KEY, "on");
      if (el) el.muted = false;
    }
    setSeen(true);
    remember(`tpf.seen.${asset!.id}`, "yes");
    if (!el) {
      setPlaying((p) => (withSound ? true : !p));
      return;
    }
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  function restart() {
    if (ref.current) {
      ref.current.currentTime = 0;
      void ref.current.play();
    }
    setPlaying(true);
  }

  const btn =
    "inline-flex items-center gap-2 rounded-lg border border-wireline px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-accent hover:text-foreground";

  return (
    <figure className="w-full overflow-hidden rounded-2xl border border-wireline bg-card/50">
      <div className="relative aspect-video w-full bg-secondary/60">
        {asset.src ? (
          <video
            ref={ref}
            src={asset.src}
            poster={asset.poster}
            muted={muted}
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {asset.butler} · {asset.label}
            </span>
            <span className="text-sm font-semibold text-foreground">{asset.title}</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {playing ? "Playing (silent preview)" : "Sound off by default"}
            </span>
          </div>
        )}
      </div>

      <figcaption
        className={`flex flex-col gap-3 border-t border-wireline ${compact ? "p-3" : "p-4"}`}
      >
        {asset.caption && !compact && (
          <p className="text-sm leading-relaxed text-muted-foreground">{asset.caption}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => togglePlay(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-accent-foreground transition-opacity hover:opacity-90"
          >
            <Play className="h-3.5 w-3.5" />{" "}
            {asset.playOncePerSession && seen ? "Watch again" : (asset.playLabel ?? "Play")}
          </button>
          {!compact && (
            <>
              <button type="button" onClick={() => togglePlay(false)} className={btn}>
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing ? "Pause" : "Play"}
              </button>
              <button type="button" onClick={toggleMute} className={btn}>
                {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                {muted ? "Sound off" : "Sound on"}
              </button>
              <button type="button" onClick={restart} className={btn}>
                <RotateCcw className="h-3.5 w-3.5" /> Restart
              </button>
            </>
          )}
          <button type="button" onClick={() => setShowTranscript((s) => !s)} className={btn}>
            <FileText className="h-3.5 w-3.5" /> {showTranscript ? "Hide" : "Transcript"}
          </button>
        </div>

        {showTranscript && (
          <p className="rounded-lg border border-wireline bg-background/60 p-3 text-xs leading-relaxed text-muted-foreground">
            {asset.transcript ??
              "Transcript and captions will be attached to this clip with the final recording."}
          </p>
        )}

        {showMeta && (
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            {asset.label} · {asset.version} · {asset.duration ?? "—"} · refresh expected in 6–12
            months
          </p>
        )}
      </figcaption>
    </figure>
  );
}
