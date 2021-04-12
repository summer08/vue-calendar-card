const path = require('path')
const CompressionPlugin = require("compression-webpack-plugin") //提供带 Content-Encoding 编码的压缩版的资源

function resolve(dir) {
    return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,
    assetsDir: 'static', // 静态资源目录 (js, css, img, fonts)
    //打包app时放开该配置
    publicPath:'./',
    outputDir: process.env.outputDir,
    configureWebpack: config => {
        //生产环境取消 console.log
        /*if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }*/
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('@assets', resolve('src/assets'))
            .set('@comp', resolve('src/components'))
            .set('@views', resolve('src/views'))
            .set('@layout', resolve('src/layout'))
            .set('@static', resolve('src/static'))
            .set('@mobile', resolve('src/modules/mobile'))

        //生产环境，开启js\css压缩
        if (process.env.NODE_ENV === 'production') {
            config.plugin('compressionPlugin').use(new CompressionPlugin({
                test: /\.js$|.\css|.\less/, // 匹配文件名
                threshold: 10240, // 对超过10k的数据压缩
                deleteOriginalAssets: false // 不删除源文件
            }))
        }

        // 配置 webpack 识别 markdown 为普通的文件
        config.module
            .rule('markdown')
            .test(/\.md$/)
            .use()
            .loader('file-loader')
            .end()
    },

    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({ // 把px单位换算成rem单位
                        rootValue: 75, // 换算的基数(设计图750的根字体为75)
                        // selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
                        propList: ['*']
                    })
                ]
            },
            less: {
                modifyVars: {
                    /* less 变量覆盖，用于自定义 ant design 主题 */
                    'primary-color': '#1890FF',
                    'link-color': '#1890FF',
                    'border-radius-base': '4px',
                },
                javascriptEnabled: true,
            }
        }
    },

    devServer: {
        port: 3000,
        proxy: {
            /* '/api': {
               target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro', //mock API接口系统
               ws: false,
               changeOrigin: true,
               pathRewrite: {
                 '/jeecg-boot': ''  //默认所有请求都加了jeecg-boot前缀，需要去掉
               }
             },*/
            '/mapapi': {
                target: 'https://api.fish.hcstzz.com/api', //请求本地 需要jeecg-boot后台项目
                // target:  'https://geo.datav.aliyun.com/areas_v2/bound',
                ws: true,
                changeOrigin: true,
                pathRewrite:{'^/mapapi':''}
            },
        }
    },

    lintOnSave: false
}