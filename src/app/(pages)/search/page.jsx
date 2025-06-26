import { Suspense } from "react";

import AppData from "@data/app.json";

import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import Sidebar from "@components/Sidebar";
import BlogFiltered from '@components/blog/BlogFiltered';

import { generateJsonPostsData } from "@library/posts";

export const metadata = {
  title: {
		default: "Търсене",
	},
  description: AppData.settings.siteDescription,
}

import { promises as fs } from 'fs';

async function Search() {
  const generateJsonPosts = await generateJsonPostsData();
  const file = await fs.readFile(process.cwd() + '/src/data/.json/posts.json', 'utf8');
  const posts = JSON.parse(file);

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <Suspense fallback={<div>Зареждане...</div>}>
          <PageBanner pageTitle={"Търсене: %s"} description={"Резултати от търсенето в блога и менюто <br>на ресторант Делиорман."} breadTitle={"Търсене"} />
        </Suspense>
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ScrollHint />

              <div className="row">

                <div className="col-lg-8">

                <Suspense fallback={<div>Loading...</div>}>
                  <BlogFiltered
                    items={posts}
                    columns={2}
                  />
                </Suspense>

                </div>
                <div className="col-lg-4">
                  <div className="tst-sidebar-frame tst-pad-type-1">
                    <Sidebar />
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Search;