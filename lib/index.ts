import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { resolve } from 'path'

export type PolicyType = 'Delete' | 'Retain'

export interface LocalPathProvisionerArgs {
  namespaceName: pulumi.Input<string>
  path: pulumi.Input<string>
  policy: pulumi.Input<PolicyType>
}

export class LocalPathProvisioner extends pulumi.ComponentResource {
  public readonly chart: k8s.helm.v3.Chart

  constructor(
    name: string,
    args: LocalPathProvisionerArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('vizv:foundation:LocalPathProvisioner', name, {}, opts)

    this.chart = new k8s.helm.v3.Chart(
      name,
      {
        path: resolve('./assets/charts/local-path-provisioner'),
        namespace: args.namespaceName,
        values: {
          image: {
            // modified version to persist storage path (remove UUID)
            repository: 'vizv/local-path-provisioner'
          },
          storageClass: {
            defaultClass: true,
            reclaimPolicy: args.policy,
          },
          nodePathMap: [
            {
              node: 'DEFAULT_PATH_FOR_NON_LISTED_NODES',
              paths: [args.path],
            },
          ],
        },
      },
      {
        parent: this,
        protect: opts?.protect,
        dependsOn: opts?.dependsOn,
      },
    )
  }
}
