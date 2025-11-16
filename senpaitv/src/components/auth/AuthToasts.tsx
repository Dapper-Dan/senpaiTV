'use client';

import { useEffect, useState } from 'react';

export default function AuthToasts() {
	const [msg, setMsg] = useState<string | null>(null);

	useEffect(() => {
		function onPending(e: Event) {
			try {
				const detail = (e as CustomEvent<string>).detail;
				if (detail === 'signin') setMsg('Logging in...');
				else if (detail === 'signout') setMsg('Logging out...');
				else setMsg('Working...');
			} catch {
				setMsg('Working...');
			}
		}
		function onDone() {
			setMsg(null);
		}
		window.addEventListener('auth-pending', onPending as EventListener);
		window.addEventListener('auth-done', onDone as EventListener);
		return () => {
			window.removeEventListener('auth-pending', onPending as EventListener);
			window.removeEventListener('auth-done', onDone as EventListener);
		};
	}, []);

	if (!msg) return null;

	return (
		<div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
			<div className="mx-auto mt-2 w-fit rounded bg-zinc-800 text-white px-4 py-2 shadow-lg shadow-gray-400/20 border border-[#fefefe] pointer-events-auto">
				{msg}
			</div>
		</div>
	);
}
