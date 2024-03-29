import xml.etree.cElementTree as ET
import os

print('Укажите путь к файлу, например C:\\Users\\User\\Downloads\\List.xml')
file_path = input()
tree = ET.parse(file_path)
root = tree.getroot()


def set_dates(tree_root):
    for child in tree_root:
        if child.find('my_start_date') == None:
            ET.SubElement(child, 'my_start_date').text = '0000-00-00'
            ET.SubElement(child, 'my_finish_date').text = '0000-00-00'
            ET.indent(tree)
            # ET.dump(child)
        else:
            pass


def change_tag(tree_root):
    for child in tree_root:
        child.tag = 'my_times_read'


match root[1].tag:
    case 'anime': set_dates(root.findall('anime'))
    case 'manga': set_dates(root.findall('manga')), change_tag(root.findall('manga/my_times_watched'))


tree.write(os.path.join(os.path.dirname(file_path) ,os.path.basename(file_path).replace('.xml', '_updated.xml')), encoding="utf-8",)
