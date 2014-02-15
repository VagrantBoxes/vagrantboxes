<?php

$dom = new DOMDocument();
$dom->load('table.html');
$xpath = new DOMXpath($dom);
$elements = $xpath->query("/table/tr");

// 161 rows
for($i=1; $i<2; $i++) {
    $row = $elements->item($i);

    $xpath = new DOMXpath($row);
    $elements = $xpath->query("/tr/td");

    echo $elements->length;
//    $name = trim($list->item(1)->textContent);
//    $provider = trim($list->item(3)->textContent);
//    $url = trim(str_replace('Copy','', $list->item(5)->textContent));
//    $size = trim(str_replace(array('MB', 'M'), array('', ''), $list->item(7)->textContent));
//    echo "$name | $provider | $url | $size \n";
}