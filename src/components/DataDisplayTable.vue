<!-- components/DataDisplayTable.vue -->
<template>
  <v-data-table
    :headers="headers"
    :items="items"
    density="compact"
  >
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn @click="openModal(item)">Edit</v-btn>
    </template>
  </v-data-table>
    <CurationModal
    v-if="showModal"
    :item="selectedItem"
    :open="showModal"
    @save="saveData"
    @close="closeModal"
  />
</template>

<script>
import { ref, onMounted } from 'vue';
import CurationModal from './CurationModal.vue';
import { getGenes } from '@/stores/store';

export default {
  components: {
    CurationModal,
  },
  setup() {
    let items = ref([
      {
          "approved_symbol": "ACE",
          "hgnc_id": 2707,
          "evidence_count": 5,
          "source_count_percentile": 4.257174056734751,
          "pLI": 0,
          "oe_lof": 0.8746,
          "lof_z": 0.97837,
          "mis_z": -0.69323,
          "omim_summary": "{Stroke, hemorrhagic}[OMIM:614519]-NA | Renal tubular dysgenesis[OMIM:267430]-Autosomal recessive inheritance | {Microvascular complications of diabetes 3}[OMIM:612624]-NA",
          "gencc_summary": "Limited, Supportive (renal tubular dysgenesis of genetic origin[MONDO:0009970]-Autosomal recessive) | Limited (intracerebral hemorrhage[MONDO:0013792]-Unknown) | Strong (renal tubular dysgenesis[MONDO:0017609]-Autosomal recessive)",
          "clingen_summary": "NULL",
          "clinvar": "P:24; LP:15; VUS:221",
          "clinical_groups_p": "OMIM:267430 (complement: 0.143 | cakut: 0.016 | glomerulopathy: 0.007 | cyst_cilio: 0.003)",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "OMIM:267430 (syndromic: 0.014 | skeletal: 0.05 | neurologic: 0.029)",
          "mgi_phenotype": "hm (true); ht (true)",
          "interaction_score": 0.5,
          "stringdb_interaction_sum_score": 3097,
          "stringdb_interaction_normalized_score": 0.5723270440251572,
          "stringdb_interaction_string": "9606.ENSP00000252486:325, 9606.ENSP00000305302:442, 9606.ENSP00000215832:379, 9606.ENSP00000355627:700, 9606.ENSP00000368727:311, 9606.ENSP00000231509:216, 9606.ENSP00000216181:508, 9606.ENSP00000325822:216",
          "expression_score": 0,
          "gtex_kidney_medulla": 2.02982,
          "gtex_kidney_cortex": 3.8524,
          "descartes_kidney_tpm": 2.0540630055529,
          "cur_id": "cur_001"
        },
        {
          "approved_symbol": "ACTG2",
          "hgnc_id": 145,
          "evidence_count": 4,
          "source_count_percentile": 3.007962351574665,
          "pLI": "NULL",
          "oe_lof": "NULL",
          "lof_z": "NULL",
          "mis_z": "NULL",
          "omim_summary": "Megacystis-microcolon-intestinal hypoperistalsis syndrome 5[OMIM:619431]-Autosomal dominant inheritance | Visceral myopathy 1[OMIM:155310]-Autosomal dominant inheritance",
          "gencc_summary": "Supportive (megacystis-microcolon-intestinal hypoperistalsis syndrome[MONDO:0007960]-Autosomal dominant) | Supportive (familial visceral myopathy[MONDO:0016829]-Autosomal dominant) | Strong (visceral myopathy 1[MONDO:0020754]-Autosomal dominant)",
          "clingen_summary": "NULL",
          "clinvar": "P:22; LP:17; VUS:28",
          "clinical_groups_p": "OMIM:155310 (cakut: 0.137 | cyst_cilio: 0.021 | cancer: 0.02 | nephrocalcinosis: 0.007 | glomerulopathy: 0.002); OMIM:619431 (cakut: 0.097 | cancer: 0.02 | cyst_cilio: 0.018 | nephrocalcinosis: 0.007 | glomerulopathy: 0.002)",
          "onset_groups_p": "OMIM:619431 (antenatal_or_congenital: 0.899)",
          "syndromic_groups_p": "OMIM:155310 (syndromic: 0.005 | neurologic: 0.011)",
          "mgi_phenotype": "hm (false); ht (false)",
          "interaction_score": 0.5,
          "stringdb_interaction_sum_score": 2582,
          "stringdb_interaction_normalized_score": 0.5073375262054507,
          "stringdb_interaction_string": "9606.ENSP00000262518:194, 9606.ENSP00000357283:209, 9606.ENSP00000311505:153, 9606.ENSP00000252699:206, 9606.ENSP00000216181:910, 9606.ENSP00000379616:910",
          "expression_score": 0,
          "gtex_kidney_medulla": 2.30606,
          "gtex_kidney_cortex": 0.9816030000000001,
          "descartes_kidney_tpm": 0.838759965043748,
          "cur_id": "cur_002"
        },
        {
          "approved_symbol": "ACTN4",
          "hgnc_id": 166,
          "evidence_count": 5,
          "source_count_percentile": 4.057388332144462,
          "pLI": 1,
          "oe_lof": 0.02077,
          "lof_z": 6.2964,
          "mis_z": 4.1552,
          "omim_summary": "Glomerulosclerosis, focal segmental, 1[OMIM:603278]-Autosomal dominant inheritance",
          "gencc_summary": "Moderate (focal segmental glomerulosclerosis 1[MONDO:0011303]-Autosomal dominant) | Strong, Supportive (familial idiopathic steroid-resistant nephrotic syndrome[MONDO:0019006]-Autosomal dominant)",
          "clingen_summary": "NULL",
          "clinvar": "P:5; LP:5; VUS:89",
          "clinical_groups_p": "OMIM:603278 (glomerulopathy: 0.235 | cyst_cilio: 0.165 | cakut: 0.069 | cancer: 0.05 | tubulopathy: 0.049 | nephrocalcinosis: 0.042 | complement: 0.036)",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "NULL",
          "mgi_phenotype": "hm (true); ht (false)",
          "interaction_score": 1,
          "stringdb_interaction_sum_score": 11037,
          "stringdb_interaction_normalized_score": 0.9308176100628931,
          "stringdb_interaction_string": "9606.ENSP00000269305:163, 9606.ENSP00000231509:309, 9606.ENSP00000265970:190, 9606.ENSP00000358866:187, 9606.ENSP00000288235:321, 9606.ENSP00000386896:650, 9606.ENSP00000352264:437, 9606.ENSP00000386857:206, 9606.ENSP00000362924:292, 9606.ENSP00000356587:739, 9606.ENSP00000482968:380, 9606.ENSP00000356319:292, 9606.ENSP00000376410:336, 9606.ENSP00000379204:206, 9606.ENSP00000367316:650, 9606.ENSP00000265748:473, 9606.ENSP00000216181:447, 9606.ENSP00000362424:292, 9606.ENSP00000200181:650, 9606.ENSP00000340913:454, 9606.ENSP00000377789:728, 9606.ENSP00000287820:292, 9606.ENSP00000356405:292, 9606.ENSP00000368190:914, 9606.ENSP00000346839:346, 9606.ENSP00000228606:292, 9606.ENSP00000352138:499",
          "expression_score": 0.5,
          "gtex_kidney_medulla": 157.86700000000002,
          "gtex_kidney_cortex": 140.608,
          "descartes_kidney_tpm": 426.248179504114,
          "cur_id": "cur_003"
        },
        {
          "approved_symbol": "ADAMTS13",
          "hgnc_id": 1366,
          "evidence_count": 5,
          "source_count_percentile": 3.273615423619376,
          "pLI": "NULL",
          "oe_lof": "NULL",
          "lof_z": "NULL",
          "mis_z": "NULL",
          "omim_summary": "Thrombotic thrombocytopenic purpura, hereditary[OMIM:274150]-Autosomal recessive inheritance",
          "gencc_summary": "Definitive, Strong, Strong, Supportive (congenital thrombotic thrombocytopenic purpura[MONDO:0010122]-Autosomal recessive)",
          "clingen_summary": "Definitive (congenital thrombotic thrombocytopenic purpura[MONDO:0010122]-AR)",
          "clinvar": "P:41; LP:22; VUS:227",
          "clinical_groups_p": "OMIM:274150 (complement: 0.143 | glomerulopathy: 0.042 | tubulopathy: 0.028 | nephrocalcinosis: 0.021)",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "OMIM:274150 (syndromic: 0.005 | neurologic: 0.01)",
          "mgi_phenotype": "hm (false); ht (false)",
          "interaction_score": 0.5,
          "stringdb_interaction_sum_score": 793,
          "stringdb_interaction_normalized_score": 0.1928721174004193,
          "stringdb_interaction_string": "9606.ENSP00000386896:244, 9606.ENSP00000367316:225, 9606.ENSP00000437256:161, 9606.ENSP00000280481:163",
          "expression_score": 0.5,
          "gtex_kidney_medulla": 4.84555,
          "gtex_kidney_cortex": 3.2947699999999998,
          "descartes_kidney_tpm": 13.3578951909432,
          "cur_id": "cur_004"
        },
        {
          "approved_symbol": "ADAMTS9",
          "hgnc_id": 13202,
          "evidence_count": 2,
          "source_count_percentile": 1.797236241211451,
          "pLI": 0.000001,
          "oe_lof": 0.29427,
          "lof_z": 7.1321,
          "mis_z": 0.95461,
          "omim_summary": "NULL",
          "gencc_summary": "Limited (ciliopathy[MONDO:0005308]-Autosomal recessive) | Supportive (nephronophthisis 1[MONDO:0009728]-Autosomal recessive)",
          "clingen_summary": "Limited (ciliopathy[MONDO:0005308]-AR)",
          "clinvar": "P:0; LP:1; VUS:120",
          "clinical_groups_p": "NULL",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "NULL",
          "mgi_phenotype": "hm (false); ht (false)",
          "interaction_score": 0,
          "stringdb_interaction_sum_score": 171,
          "stringdb_interaction_normalized_score": 0.031446540880503145,
          "stringdb_interaction_string": "9606.ENSP00000256646:171",
          "expression_score": 0.5,
          "gtex_kidney_medulla": 11.9264,
          "gtex_kidney_cortex": 10.9867,
          "descartes_kidney_tpm": 204.377287163022,
          "cur_id": "cur_005"
        },
    ]);

    const headers = [
      { title: 'Approved Symbol', value: 'approved_symbol' },
      { title: 'HGNC ID', value: 'hgnc_id' },
      { title: 'Evidence count', value: 'evidence_count' },
      { title: 'Actions', value: 'actions', sortable: false },
    ];

    const showModal = ref(false);
    const selectedItem = ref(null);

    const openModal = (item) => {
      selectedItem.value = item;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const saveData = (updatedItem) => {
      console.log(updatedItem);
      // Handle the save operation here...
    };

    onMounted(async () => {
      items.value = await getGenes(); // Assign the returned data to items
    });

    return {
      items,
      headers,
      showModal,
      selectedItem,
      openModal,
      closeModal,
      saveData,
      getGenes
    };
  },
};
</script>
