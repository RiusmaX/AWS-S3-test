const AWS = require('aws-sdk')
const fs = require('fs')

const AWS_ACCESS_KEY_ID=''
const AWS_SECRET_ACCESS_KEY=''
const AWS_REGION=''
const AWS_BUCKET_NAME=''
const AWS_BUCKET_PREFIX=''

// configuring the AWS environment
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
})

const writeCSV = () => {
  const csv = 'test,test,test\n'
  try {
    fs.appendFileSync('./test.csv', csv)
  } catch (error) {
    console.error(error)
  }
}

const uploadFile = () => {
  return new Promise((resolve, reject) => {
    const file = fs.readFileSync('./test.csv')
    const s3 = new AWS.S3()
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Prefix: AWS_BUCKET_PREFIX,
      Key: 'test.csv',
      Body: file
    }

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const listDirectories = params => {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3()
    const s3params = {
      Bucket: AWS_BUCKET_NAME,
      MaxKeys: 20,
      Delimiter: '/',
      Prefix: AWS_BUCKET_PREFIX
    }
    s3.listObjectsV2(s3params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

(async () => {
  try {
      const directories = await listDirectories();
      console.log(directories);

      await writeCSV()

      await uploadFile()

  } catch (e) {
      console.error(e)
  }
})();
