[x] Move docs to this repo

- Where should i put them? prob in same workspace as library, they are sync to gitbook

[] Check if it's doable to infer the async tasks types without passing the whole config, only the step name as in useTour("someAsyncStep")

[] Refactor the tour state machine generator (related: review the state machine library)

[] "pending" vs "processing", probaly not the best semantics...

[] Understand how hard / doable it is to make it compatible to other react frameworks (remix, tanstack, react router), or even not react... svelte??

[] Update docs.

- TourViewport no longer necesary
- async tasks new syntax

[] why the "pending" here? (from docs)
"During page transitions, Tourista creates special navigation states:

navigatingTo*[stepId] - For regular steps
navigatingTo*[stepId]\_pending - For async steps"

[] Docs should be exposing less internals, move them to an "advance" or "concepts" section

[] what happens if it cannot find the target after navigation? should "anything" happen at all?

[] (from docs) Understand if this is really necesary:
Important: The DefaultCard component requires Tailwind CSS v4 to render properly. Add this to your global CSS file:

/_ In your global.css or app.css _/
@source '../../node\*modules/Tourista/dist/\*\*/\_.{js,mjs}';

[] is this true anymore?
"t only initializes when a tour is active, keeping the library non-invasive."

[] why do we need to force the user to add that? can't we include it ourselves in the wrapper??
