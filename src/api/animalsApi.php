<?php

require_once dirname(__FILE__).'/../db/DBAnimals.class.php';
require_once dirname(__FILE__).'/Utils.class.php';

$db = new DBAnimals();

try {
	if ($_SERVER['REQUEST_METHOD'] == "GET") {
		Utils::checkGetArgs('action');
		switch ($_GET['action']) {
			case "getList":
				Utils::checkGetArgs('job');
				echo json_encode($db->getList($_GET['job']));
				break;
			case "getAnimal":
				Utils::checkGetArgs('id');
				echo json_encode($db->getInfo($_GET['id']));
				break;
		}
	} else {
		Utils::checkPostArgs('action');
		switch ($_POST['action']) {
			case "add":
				Utils::checkPostArgs(array('name', 'gender', 'type', 'race', 'puce', 'birthdate', 'size', 'colour', 'desc', 'isAlive', 'headMark', 'footMark', 'inFarriery', 'inPension'));
				$id = $db->add($_POST['name'],	$_POST['gender'], $_POST['type'], $_POST['race'],
					$_POST['puce'], $_POST['birthdate'], $_POST['size'],
					$_POST['colour'], $_POST['desc'], $_POST['isAlive'], $_POST['headMark'], $_POST['footMark']);
				if ($_POST['inFarriery'] == "true") $db->linkToJob("FARRIERY", $id);
				if ($_POST['inPension'] == "true") $db->linkToJob("PENSION", $id);
				echo json_encode(array("id"=>$id));
				break;
			case "edit":
				Utils::checkPostArgs(array('id', 'name', 'gender', 'type', 'race', 'puce', 'birthdate', 'size', 'colour', 'desc', 'isAlive', 'headMark', 'footMark', 'inFarriery', 'inPension'));
					$db->edit($_POST['id'],
					$_POST['name'],	$_POST['gender'], $_POST['type'], $_POST['race'],
					$_POST['puce'], $_POST['birthdate'], $_POST['size'],
					$_POST['colour'], $_POST['desc'], $_POST['isAlive'], $_POST['headMark'], $_POST['footMark']);
				if ($_POST['inFarriery'] == "true") $db->linkToJob("FARRIERY", $_POST['id']);
				if ($_POST['inPension'] == "true") $db->linkToJob("PENSION", $_POST['id']);
				echo json_encode(null);
				break;
			case "delete":
				Utils::checkPostArgs('id');
				$db->delete($_POST['id']);
				break;
		}
	}
}
catch(Exception $e) {
	echo json_encode(array("Error", $e->getMessage()));
}

$db->close();

?>