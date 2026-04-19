// @ts-nocheck
import * as __fd_glob_13 from "../content/docs/architecture/security-model.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/architecture/overview.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/architecture/authentication.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/extension/walrus.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/extension/overview.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/extension/crypto-engine.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/extension/background.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/contract/recovery-module.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/contract/overview.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/contract/gas-station.mdx?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/extension/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/architecture/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/contract/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "contract/meta.json": __fd_glob_1, "architecture/meta.json": __fd_glob_2, "extension/meta.json": __fd_glob_3, }, {"contract/gas-station.mdx": __fd_glob_4, "contract/overview.mdx": __fd_glob_5, "contract/recovery-module.mdx": __fd_glob_6, "extension/background.mdx": __fd_glob_7, "extension/crypto-engine.mdx": __fd_glob_8, "extension/overview.mdx": __fd_glob_9, "extension/walrus.mdx": __fd_glob_10, "architecture/authentication.mdx": __fd_glob_11, "architecture/overview.mdx": __fd_glob_12, "architecture/security-model.mdx": __fd_glob_13, });