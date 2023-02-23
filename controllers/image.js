const hangleImage = (req, res, knex, ClarifaiStub, grpc, KEY) => {
  if (req.body.imageURL) {
    const { id, imageURL } = req.body;

    const USER_ID = "clarifai";
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = KEY;
    const APP_ID = "main";
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
    const IMAGE_URL = imageURL.trim();

    const stub = ClarifaiStub.grpc();

    // This will be used by every Clarifai endpoint call
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);
    stub.PostModelOutputs(
      {
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        model_id: MODEL_ID,
        version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version.
        inputs: [
          { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } },
        ],
      },
      metadata,
      (err, response) => {
        if (err) {
          throw new Error(err);
        }

        if (response.status.code !== 10000) {
          throw new Error(
            "Post model outputs failed, status: " + response.status.description
          );
        }

        // Since we have one input, one output will exist here.
        const clarifaiOutput = response;
        knex("users")
          .where("id", "=", id)
          .increment("entries", 1)
          .returning("entries")
          .then((entries) => {
            res.json({
              entries: entries[0].entries,
              clarifaiOutput: clarifaiOutput,
            });
          })
          .catch((err) => res.status(400).json(err, " unable to get entries"));
      }
    );
  } else {
    res.status(400).json('unable to get image URL')
  }

  // knex('users')
  // .where('id', '=', id)
  // .increment('entries', 1)
  // .returning('entries')
  // .then(entries => {
  //     res.json(entries[0].entries,)
  // })
  // .catch(err => res.status(400).json(err, ' unable to get entries'))
};

module.exports = {
  hangleImage: hangleImage,
};
