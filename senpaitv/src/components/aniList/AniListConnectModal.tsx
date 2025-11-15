'use client';

import React from 'react';

interface AniListConnectModalProps {
	open: boolean;
	isConnected: boolean;
	onClose: () => void;
	onConnect: () => void | Promise<void>;
	onSync: () => void | Promise<void>;
}

export default function AniListConnectModal({
	open,
	isConnected,
	onClose,
	onConnect,
	onSync,
}: AniListConnectModalProps) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/60" onClick={onClose} />
			<div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl border border-[#171717]">
				<h3 className="text-xl font-semibold mb-4 text-[#171717]">AniList</h3>
				<p className="mb-6 text-[#171717]">
					{isConnected
						? 'Your AniList account is connected and syncs periodically. Manually sync now to update your progress and lists.'
						: 'Connect your AniList account to sync your list and progress.'}
				</p>
				<div className="flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
					>
						Cancel
					</button>
					{isConnected ? (
						<button
							onClick={onSync}
							className="px-4 py-2 rounded bg-[#171717] hover:bg-[#171717]/80"
						>
							Sync Now
						</button>
					) : (
						<button
							onClick={onConnect}
							className="px-4 py-2 rounded bg-[#171717] hover:bg-[#171717]/80"
						>
							Connect
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
