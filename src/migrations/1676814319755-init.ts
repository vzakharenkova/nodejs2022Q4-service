import { MigrationInterface, QueryRunner } from "typeorm";

export class init1676814319755 implements MigrationInterface {
    name = 'init1676814319755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "artistId" uuid, "albumId" uuid, "duration" integer NOT NULL, CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "artists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL, CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "albums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_9a7b1ca04a6ba66310242152598" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" bigint NOT NULL, "updatedAt" bigint NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorities_artists_artists" ("favoritiesId" uuid NOT NULL, "artistsId" uuid NOT NULL, CONSTRAINT "PK_3aba0699846ca857cf4fcf138c7" PRIMARY KEY ("favoritiesId", "artistsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_417064e79916e6a51e3fc12cbb" ON "favorities_artists_artists" ("favoritiesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4018089fa59f4fe6445c526f2f" ON "favorities_artists_artists" ("artistsId") `);
        await queryRunner.query(`CREATE TABLE "favorities_albums_albums" ("favoritiesId" uuid NOT NULL, "albumsId" uuid NOT NULL, CONSTRAINT "PK_388bca2a695fc7e87649ddc0629" PRIMARY KEY ("favoritiesId", "albumsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6d0211410680bfacfa7d1cc692" ON "favorities_albums_albums" ("favoritiesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_add32ffaabeb0f31dd1525397a" ON "favorities_albums_albums" ("albumsId") `);
        await queryRunner.query(`CREATE TABLE "favorities_tracks_tracks" ("favoritiesId" uuid NOT NULL, "tracksId" uuid NOT NULL, CONSTRAINT "PK_654be99be84520e094246002f34" PRIMARY KEY ("favoritiesId", "tracksId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0bc099704867f2badee10f1fa9" ON "favorities_tracks_tracks" ("favoritiesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_93bbdd8edc919884400518d84e" ON "favorities_tracks_tracks" ("tracksId") `);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_62f595181306916265849fced48" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_5c52e761792791f57de2fec342d" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorities_artists_artists" ADD CONSTRAINT "FK_417064e79916e6a51e3fc12cbb4" FOREIGN KEY ("favoritiesId") REFERENCES "favorities"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorities_artists_artists" ADD CONSTRAINT "FK_4018089fa59f4fe6445c526f2f7" FOREIGN KEY ("artistsId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorities_albums_albums" ADD CONSTRAINT "FK_6d0211410680bfacfa7d1cc6924" FOREIGN KEY ("favoritiesId") REFERENCES "favorities"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorities_albums_albums" ADD CONSTRAINT "FK_add32ffaabeb0f31dd1525397af" FOREIGN KEY ("albumsId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorities_tracks_tracks" ADD CONSTRAINT "FK_0bc099704867f2badee10f1fa9e" FOREIGN KEY ("favoritiesId") REFERENCES "favorities"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorities_tracks_tracks" ADD CONSTRAINT "FK_93bbdd8edc919884400518d84ef" FOREIGN KEY ("tracksId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorities_tracks_tracks" DROP CONSTRAINT "FK_93bbdd8edc919884400518d84ef"`);
        await queryRunner.query(`ALTER TABLE "favorities_tracks_tracks" DROP CONSTRAINT "FK_0bc099704867f2badee10f1fa9e"`);
        await queryRunner.query(`ALTER TABLE "favorities_albums_albums" DROP CONSTRAINT "FK_add32ffaabeb0f31dd1525397af"`);
        await queryRunner.query(`ALTER TABLE "favorities_albums_albums" DROP CONSTRAINT "FK_6d0211410680bfacfa7d1cc6924"`);
        await queryRunner.query(`ALTER TABLE "favorities_artists_artists" DROP CONSTRAINT "FK_4018089fa59f4fe6445c526f2f7"`);
        await queryRunner.query(`ALTER TABLE "favorities_artists_artists" DROP CONSTRAINT "FK_417064e79916e6a51e3fc12cbb4"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_5c52e761792791f57de2fec342d"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_62f595181306916265849fced48"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_93bbdd8edc919884400518d84e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0bc099704867f2badee10f1fa9"`);
        await queryRunner.query(`DROP TABLE "favorities_tracks_tracks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_add32ffaabeb0f31dd1525397a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6d0211410680bfacfa7d1cc692"`);
        await queryRunner.query(`DROP TABLE "favorities_albums_albums"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4018089fa59f4fe6445c526f2f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_417064e79916e6a51e3fc12cbb"`);
        await queryRunner.query(`DROP TABLE "favorities_artists_artists"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "favorities"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`DROP TABLE "artists"`);
        await queryRunner.query(`DROP TABLE "tracks"`);
    }

}
