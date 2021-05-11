import CommentContract from '@DataContracts/CommentContract';
import ICommentRepository from './ICommentRepository';
import UrlMapper from '@Shared/UrlMapper';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import HttpClient from '@Shared/HttpClient';

export default class EntryCommentRepository implements ICommentRepository {
  private baseUrl: string;

  constructor(
    private readonly httpClient: HttpClient,
    private urlMapper: UrlMapper,
    resourcePath: string,
  ) {
    this.baseUrl = UrlMapper.mergeUrls('/api/', resourcePath);
  }

  public createComment = (
    entryId: number,
    contract: CommentContract,
  ): Promise<CommentContract> => {
    var url = this.urlMapper.mapRelative(
      UrlMapper.buildUrl(this.baseUrl, entryId.toString(), '/comments'),
    );
    return this.httpClient.post<CommentContract>(url, contract);
  };

  public deleteComment = (commentId: number): Promise<void> => {
    var url = this.urlMapper.mapRelative(
      UrlMapper.buildUrl(this.baseUrl, '/comments/', commentId.toString()),
    );
    return this.httpClient.delete<void>(url);
  };

  public getComments = async (listId: number): Promise<CommentContract[]> => {
    var url = this.urlMapper.mapRelative(
      UrlMapper.buildUrl(this.baseUrl, listId.toString(), '/comments/'),
    );
    const result = await this.httpClient.get<
      PartialFindResultContract<CommentContract>
    >(url);
    return result.items;
  };

  public updateComment = (
    commentId: number,
    contract: CommentContract,
  ): Promise<void> => {
    var url = this.urlMapper.mapRelative(
      UrlMapper.buildUrl(this.baseUrl, '/comments/', commentId.toString()),
    );
    return this.httpClient.post<void>(url, contract);
  };
}
