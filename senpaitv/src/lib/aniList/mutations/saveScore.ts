import { gql } from "graphql-request";
import { createAuthenticatedClient } from "./client";

const SAVE_MEDIA_LIST_SCORE_MUTATION = gql`
  mutation SaveMediaListEntry($mediaId: Int!, $score: Float) {
    SaveMediaListEntry(mediaId: $mediaId, score: $score) {
      id
      mediaId
      score
    }
  }
`;

export async function setMediaListScore(
  accessToken: string,
  mediaId: number,
  score: number
) {
  const client = createAuthenticatedClient(accessToken);
  return client.request(SAVE_MEDIA_LIST_SCORE_MUTATION, {
    mediaId,
    score,
  });
}
