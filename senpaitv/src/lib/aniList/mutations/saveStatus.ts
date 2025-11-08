import { gql } from "graphql-request";
import { createAuthenticatedClient } from "./client";

const SAVE_MEDIA_LIST_STATUS_MUTATION = gql`
  mutation SaveMediaListEntry($mediaId: Int!, $status: MediaListStatus!) {
    SaveMediaListEntry(mediaId: $mediaId, status: $status) {
      id
      mediaId
      status
    }
  }
`;

export async function setMediaListStatus(
  accessToken: string,
  mediaId: number,
  status: "PLANNING" | "CURRENT" | "COMPLETED"
) {
  const client = createAuthenticatedClient(accessToken);
  return client.request(SAVE_MEDIA_LIST_STATUS_MUTATION, {
    mediaId,
    status,
  });
}
