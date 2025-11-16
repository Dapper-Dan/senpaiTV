'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getOrCreateUser, updateUserProfile } from '@/app/actions/user';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
	const { data: session } = useSession();
	const router = useRouter();
	const [name, setName] = useState('');
	const [image, setImage] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const u = await getOrCreateUser();
				if (cancelled) return;
				setName(u?.name || '');
				setImage(u?.image || '');
			} catch {
				// ignore;
			}
		})();
		return () => { cancelled = true; };
	}, [session?.user]);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			setImage(result);
		};
		reader.readAsDataURL(file);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setSaved(false);
		try {
			setLoading(true);
			await updateUserProfile({ name, image });
			setSaved(true);
			try { window.dispatchEvent(new Event('profile-updated')); } catch {}
			router.refresh();
		} catch (e) {
			setError('Failed to save changes');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen w-full flex items-center justify-center">
			<div className="w-full max-w-xl">
				<h1 className="text-4xl font-bold mb-10 text-center">Edit Profile</h1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-8">
					<div className="flex items-center gap-6">
						<div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
							{image ? (
								<img src={image} alt="Avatar" className="w-full h-full object-cover" />
							) : (
								<span className="text-gray-300 text-sm">No Image</span>
							)}
						</div>
						<div className="flex-1">
							<label className="block text-sm text-gray-300 mb-2">Upload Profile Photo</label>
							<input
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600"
							/>
							<p className="text-gray-400 text-xs mt-2">Supported: JPG, PNG, GIF. Stored locally in your profile.</p>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-2xl font-semibold">Username</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-white py-3 text-white placeholder-gray-500"
						/>
					</div>

					{error && <div className="text-red-500 text-sm">{error}</div>}
					{saved && <div className="text-green-500 text-sm">Saved!</div>}

					<div className="flex justify-end">
						<button
							type="submit"
							disabled={loading}
							className="rounded-lg border border-gray-500 px-6 py-3 uppercase tracking-wide disabled:opacity-50 button-primary"
						>
							{loading ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
