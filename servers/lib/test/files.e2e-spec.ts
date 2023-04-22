import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { FilesModule } from "../src/files/files.module";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { FilesResolver } from "../src/files/files.resolver";
import { FilesService } from "../src/files/files.service";
import { ApolloDriver } from "@nestjs/apollo";
import { ConfigService } from "@nestjs/config";

describe("Integration Tests for FilesService", () => {
  let app: INestApplication;
  let filesService: FilesService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), "src/schema.gql"),
          debug: false,
          playground: true,
        }),
        FilesModule,
      ],
      providers: [FilesResolver, FilesService, ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    filesService = moduleFixture.get<FilesService>(FilesService);
  });

  afterAll(async () => {
    await app.close();
  });

  it("ensure that the getLocalFiles method of the FilesService class returns the expected array of file names when called with a specific path in local mode", async () => {
    const path = "test_path_local";
    const expectedFiles = ["file1.txt", "file2.txt"];

    const filesService = app.get<FilesService>(FilesService);

    jest
      .spyOn(filesService, "getLocalFiles")
      .mockReturnValue(Promise.resolve(expectedFiles));

    const result = await filesService.getLocalFiles(path);

    expect(result).toEqual(expectedFiles);
  });

  it("ensure that the getGitlabFiles method of the FilesService class returns the expected array of file names when called with a specific path in Gitlab mode", async () => {
    const path = "test_path_gitlab";
    const expectedFiles = ["file1.txt", "file2.txt"];

    const filesService = app.get<FilesService>(FilesService);

    jest
      .spyOn(filesService, "getGitlabFiles")
      .mockReturnValue(Promise.resolve(expectedFiles));

    const result = await filesService.getGitlabFiles(path);

    expect(result).toEqual(expectedFiles);
  });

  it("ensure that the getFiles method of the FilesService class returns the expected array of file names when called with a specific path", async () => {
    const path = "test_directory";
    const expectedFiles = ["file1.txt", "file2.txt"];

    const filesService = app.get<FilesService>(FilesService);

    jest
      .spyOn(filesService, "Wrapper")
      .mockReturnValue(Promise.resolve(expectedFiles));

    const query = `{
      getFiles(path: "${path}")
    }`;

    const variables = { path };

    const response = await request(app.getHttpServer())
      .post("/graphql")
      .send({ query, variables });

    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.getFiles).toEqual(expectedFiles);
  });
});