import functions from '@Shared/GlobalFunctions';
import ResourcesContract from '@DataContracts/ResourcesContract';
import HttpClient from '@Shared/HttpClient';

export default class ResourceRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private baseUrl: string,
  ) {}

  public getList = (
    cultureCode: string,
    setNames: string[],
  ): Promise<ResourcesContract> => {
    var url = functions.mergeUrls(
      this.baseUrl,
      `/api/resources/${cultureCode}/`,
    );
    return this.httpClient.get<ResourcesContract>(url, { setNames: setNames });
  };
}
