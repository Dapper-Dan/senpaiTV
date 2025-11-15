import { gql } from "graphql-request";
import { createAuthenticatedClient } from "../mutations/client";

const MEDIA_LIST_COLLECTION = gql`
  query GetPlanning($userId: Int) {
    MediaListCollection(userId: $userId, status: PLANNING, type: ANIME) {
      lists {
        entries {
          mediaId
          status
        }
      }
    }
  }
`;

const VIEWER_QUERY = gql`
  query Viewer {
    Viewer {
      id
      name
    }
  }
`;

export async function getUserPlanningMediaIds(accessToken: string): Promise<number[]> {
  const client = createAuthenticatedClient(accessToken);
  const viewerRes: any = await client.request(VIEWER_QUERY);
  const userId: number | undefined = viewerRes?.Viewer?.id;
  const dataRes: any = await client.request(MEDIA_LIST_COLLECTION, { userId });
  const lists = dataRes?.MediaListCollection?.lists ?? [];

  const ids: number[] = [];
  for (const list of lists) {
    for (const entry of list?.entries ?? []) {
      if (typeof entry?.mediaId === 'number') {
        ids.push(entry.mediaId);
      }
    }
  }

  return Array.from(new Set(ids));
}
