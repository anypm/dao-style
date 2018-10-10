(window.daoStyleJsonpFunction=window.daoStyleJsonpFunction||[]).push([[68],{217:function(n,e){n.exports='<template>\n  <table class="dao-table slat demo1">\n    <thead>\n      <tr>\n        <th class="name">\n          <svg>\n            <use xlink:href="#icon_stack"></use>\n          </svg>\n          <span>应用</span>\n        </th>\n        <th>\n          <svg>\n            <use xlink:href="#icon_container"></use>\n          </svg>\n          <span>容器</span>\n        </th>\n        <th>\n          <svg>\n            <use xlink:href="#icon_status"></use>\n          </svg>\n          <span>状态</span>\n        </th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr v-for="row in rows" :key="row.name">\n        <td class="name">\n          <a :href="row.href" target="_blank">{{row.name}}</a>\n        </td>\n        <td>\n          {{row.containers}} 个\n        </td>\n        <td>\n          <dao-progress-stacked\n            :green="row.status.green"\n            :red="row.status.red"\n            :stripe="row.status.stripe"\n            :black="row.status.black">\n          </dao-progress-stacked>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</template>\n\n<script>\nexport default {\n  name: \'Demo1\',\n  data() {\n    return {\n      rows: [\n        {\n          name: \'DaoCloud Enterprise\',\n          href: \'https://www.daocloud.io/dce\',\n          containers: 1,\n          status: {\n            green: 0.1,\n            red: 0.3,\n            stripe: 0.4,\n            black: 0.2,\n          },\n        },\n        {\n          name: \'DaoCloud Services\',\n          href: \'https://www.daocloud.io/dcs\',\n          containers: 2,\n          status: {\n            green: 0.4,\n            red: 0.2,\n            stripe: 0.1,\n            black: 0.3,\n          },\n        },\n        {\n          name: \'DaoCloud DaoVoice\',\n          href: \'http://www.daovoice.io/\',\n          containers: 3,\n          status: {\n            green: 0.4,\n            red: 0.3,\n            stripe: 0.2,\n            black: 0.1,\n          },\n        },\n        {\n          name: \'DaoCloud Insight\',\n          href: \'https://www.daocloud.io/dcei\',\n          containers: 4,\n          status: {\n            green: 0.1,\n            red: 0.3,\n            stripe: 0.4,\n            black: 0.2,\n          },\n        },\n      ],\n    };\n  },\n};\n<\/script>\n\n<style lang="scss" scoped>\n.demo1 {\n  .name{\n    padding-left: 10px;\n    margin-left: 0px !important;\n  }\n}\n</style>'}}]);