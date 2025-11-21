'use client';

import { useEffect, useRef, useState } from 'react';
import { setAniListStatus } from '@/app/actions/aniList';
import { addToWatchlist } from '@/app/actions/watchlist';
import { getAniListEntryStatus, AniListStatus } from '@/lib/aniList/queries/getEntryStatus';
import styles from './statusDropdown.module.css';
import { useAniListToken } from '@/lib/aniList/client/useAniListToken';
import { emitAniListOk, emitAniListError } from '@/lib/aniList/client/events';

type LocalStatus = 'WANT_TO_WATCH' | 'WATCHING' | 'COMPLETED';

function toLabel(status: AniListStatus | LocalStatus | null): string {
  if (!status) return 'Add to Watchlist';
  if (status === 'CURRENT' || status === 'WATCHING') return 'Watching';
  if (status === 'COMPLETED') return 'Completed';
  return 'Planning';
}

function aniToLocal(status: AniListStatus): LocalStatus {
  return status === 'CURRENT' ? 'WATCHING' : status === 'COMPLETED' ? 'COMPLETED' : 'WANT_TO_WATCH';
}

interface StatusDropdownProps {
  aniListId: number;
  localAnimeId: string;
  initialLocalStatus?: LocalStatus;
}

export default function StatusDropdown({
  aniListId,
  localAnimeId,
  initialLocalStatus,
}: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<AniListStatus | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { token } = useAniListToken();

  useEffect(() => {
    if (!token) return;
    (async () => {
      const ani = await getAniListEntryStatus(token, aniListId);
      if (ani) {
        setStatus(ani);
        const localFromAni = aniToLocal(ani);

        if (localFromAni !== initialLocalStatus) {
          addToWatchlist(localAnimeId, localFromAni as any).catch(() => {});
        }
      }
    })();
  }, [aniListId, initialLocalStatus, localAnimeId, token]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleSelect(next: AniListStatus) {
    setOpen(false);
    const prev = status;
    setStatus(next);
    const t = token;
    try {
      if (t) {
        await setAniListStatus(t, aniListId, next);
      }

      const localFromAni = aniToLocal(next);
      addToWatchlist(localAnimeId, localFromAni as any).catch(() => {});
      emitAniListOk();
    } catch {
      setStatus(prev ?? null);
      emitAniListError();
    }
  }

  const options: AniListStatus[] = ['CURRENT', 'PLANNING', 'COMPLETED'];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={styles.dropdownButton + ' list-none cursor-pointer select-none flex items-center gap-2'}
      >
        <div className="text-sm md:text-lg font-semibold">{toLabel((status ?? initialLocalStatus) ?? null)}</div>
        <img
          src={"/images/icons/chevron-down.svg"}
          alt="Toggle"
          width={22}
          height={22}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul className="absolute z-10 mt-2 min-w-[120px] rounded border border-[#171717] bg-white backdrop-blur-sm py-[11px]">
          <span className="absolute -top-[7px] right-[10px] w-3 h-3 bg-white border border-[#171717] rotate-45 border-b-0 border-r-0" />
          {options.map((opt) => (
            <li
              key={opt}
              className="px-3 py-2 hover:bg-black/10 cursor-pointer text-[#171717]"
              onClick={() => handleSelect(opt)}
            >
              {toLabel(opt)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
