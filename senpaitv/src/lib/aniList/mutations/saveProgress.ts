import { gql } from "graphql-request";
import { createAuthenticatedClient } from "./client";

export async function saveEpisodeProgress(
  accessToken: string,
  mediaId: number,
  episodeNumber: number
) {
  const client = createAuthenticatedClient(accessToken);
  const mutation = gql`
    mutation SaveMediaListEntry($mediaId: Int, $progress: Int) {
      SaveMediaListEntry(mediaId: $mediaId, progress: $progress) {
        id
        progress
        status
        media {
          id
          title {
            english
            romaji
          }
        }
      }
    }
  `;

  const result = await client.request(mutation, {
    mediaId,
    progress: episodeNumber,
  });

  return result;
}
