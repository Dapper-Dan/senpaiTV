import { gql, GraphQLClient } from 'graphql-request';

export type AniListStatus = 'PLANNING' | 'CURRENT' | 'COMPLETED';

export async function getAniListEntryStatus(accessToken: string, mediaId: number): Promise<AniListStatus | null> {
  const endpoint = 'https://graphql.anilist.co';
  const client = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  const query = gql`
    query MediaListEntryStatus($mediaId: Int!) {
      Media(id: $mediaId, type: ANIME) {
        id
        mediaListEntry {
          status
        }
      }
    }
  `;

  try {
    const res = await client.request<any>(query, { mediaId });
    const status = res?.Media?.mediaListEntry?.status as AniListStatus | undefined;
    return status ?? null;
  } catch {
    return null;
  }
}
