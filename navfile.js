#!/usr/bin/env node

/**
 * @author Chenghao Liu
 * @email psitedd@gmail.com
 * @date 2017-06-18
 */
 
'use strict'
const fs = require('fs')

let ignoreCase = {}
if(process.argv[2] === '-i'){
    for (let i of process.argv.slice(3)) {
      ignoreCase[i] = true
    }
}

console.log('\n\nThe files tree is:\n=================\n\n')
const getRowInfo = (level, exLevel, fileName, fileInfo, childs) => {
  return {
    level: level,
    exLevel: exLevel,
    fileName: fileName,
    fileInfo: fileInfo,
    childs: childs
  }
}
// 是否是目录
const isDirectory = (path) => {
  try {
    let stat = fs.statSync(path)
    return stat.isDirectory()
  } catch (error) {
    return false
  }
}
// 获得子文件
const getChildren = (path) => {
  return fs.readdirSync(path)
}
// 是否有子文件
const isChildren = (path) => {
  let children = getChildren(path)
  return  children && children.length
}
const getLevelInfo = (level, exLevel, isLastFile, isChildFile, isDirectory) => {
  let levelStringArray = []
  for (let i = 0; i < level; i++) {
    levelStringArray.push('│ ')
  }
  for (let i = exLevel.length; i >= 0; i--) {
    let elv = exLevel[i]
    levelStringArray.splice(elv, 1, '  ')
  }
  // console.info(exLevel)
  let levelString = levelStringArray.join('')
  // 是否目录
  if(isDirectory && isChildFile) {
    // 是否最后一级
    if(isLastFile){
      levelString += '└─┬'
    } else {
      levelString += '├─┬'
    }
  } else {
    // 是否最后一级
      if(isLastFile){
        levelString += '└──'
      } else {
        levelString += '├──'
      }
  }
  return levelString
}
const scanFiles = (path, level, ...exLevel) => {
  let rowsInfo = []
  let files = getChildren(path)
  for (let i = 0, len = files.length; i < len; i++) {
    let fileName = files[i]
    let dirPath = path + '\/' + fileName
    // 是否忽略文件
    if(!ignoreCase[fileName]){
      let fileInfo = ''
      let isLastFile = i == len - 1
      if(isDirectory(dirPath)) {
        let isChildFile = isChildren(dirPath)
        fileInfo = getLevelInfo(level, exLevel, isLastFile, isChildFile, true)
        console.log(fileInfo + ' ' + fileName);
        // console.info(isLastFile, len)
        if(isLastFile) {
          exLevel.push(level)
        }
        let childs = scanFiles(dirPath, level + 1, ...exLevel)
        // let rowInfo = getRowInfo(level, exLevel, fileName, fileInfo, childs)
      } else {
        fileInfo = getLevelInfo(level, exLevel, isLastFile, false, false)
        console.log(fileInfo + fileName)
      }
    }
  }
  return rowsInfo
}

scanFiles('./', 1)

process.exit()