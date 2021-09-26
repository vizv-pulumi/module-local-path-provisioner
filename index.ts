import * as pulumi from '@pulumi/pulumi'
import { LocalPathProvisioner, PolicyType } from './lib'

const config = new pulumi.Config()

new LocalPathProvisioner('local-path-provisioner', {
  namespaceName: config.get('namespaceName') || 'default',
  path: config.require('path'),
  policy: config.require<PolicyType>('policy'),
})
