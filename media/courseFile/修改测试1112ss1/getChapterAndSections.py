import json

a = '{"expanded":true,"key":"root_1","title":"root","children":[{"expanded":true,"folder":true,"key":"_2","title":"1 thi","children":[{"key":"_6","title":"1.1 ashid"},{"key":"_2","title":"1.2 haha"},{"key":"_3","title":"1.3 nothing"},{"key":"_5","title":"1.4 aijd"}]},{"expanded":true,"folder":true,"key":"_5","title":"2 aisdhasd","children":[{"key":"_7","title":"2.1 asdjiw"},{"folder":true,"key":"_9","title":"2.2 saihdas"},{"folder":true,"key":"_10","title":"2.3 ijdsadNode title"},{"key":"_8","title":"2.4 jsaid"},{"folder":true,"key":"_11","title":"2.5 iasdNode title"}]},{"folder":true,"key":"_12","title":"3 asdNode title"}]}'

a = json.loads(a)


def getChapter(dict):

    chapterDict = {}  # 存储最终的章节结构

    def getChildren(key, value):  # 获取子节点
        if key == "children":
            return value
        else:
            pass

    for key, value in dict.items():  # 剔除root节点
        Chapter = getChildren(key, value)

    for i in range(len(Chapter)):
        if "children" in Chapter[i]:  # 如果存在键"children"，则准备存储其拥有的节
            for key, value in Chapter[i].items():
                chapterDict[Chapter[i]["title"]] = []  # 以该章的标题创建一个键值对
                if key == "children":  # 获取该章所拥有的节
                    Section = getChildren(key, value)
                    for j in range(len(Section)):  # 将每节的标题添加到所属章的键值对中。
                        chapterDict[Chapter[i]["title"]].append(Section[j]["title"])
        else:  # 若不存在键"children"，则存储空白的键值对
            chapterDict[Chapter[i]["title"]] = []

    return chapterDict


if __name__ == "__main__":
    b = getChapter(a)
    print(b)
